"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import type { CompanyEntry } from "../schema";

function createEmptyCompany(): CompanyEntry {
  return {
    id: crypto.randomUUID(),
    companyName: "",
    jobDescription: "",
    coverLetter: "",
    status: "idle",
  };
}

export function CoverLetterGenerator() {
  const [companies, setCompanies] = useState<CompanyEntry[]>([
    createEmptyCompany(),
  ]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

  const templateId =
    typeof window !== "undefined"
      ? localStorage.getItem("selected-template") || "loyal"
      : "loyal";

  function addCompany() {
    setCompanies((prev) => [...prev, createEmptyCompany()]);
  }

  function removeCompany(id: string) {
    setCompanies((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));
  }

  function updateCompany(id: string, field: keyof CompanyEntry, value: string) {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  }

  const generateForCompany = useCallback(
    async (company: CompanyEntry): Promise<string> => {
      const controller = new AbortController();
      abortRef.current = controller;

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id
            ? { ...c, status: "generating", coverLetter: "", error: undefined }
            : c,
        ),
      );

      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: company.jobDescription,
          companyName: company.companyName || undefined,
          templateId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg =
          typeof data.error === "string"
            ? data.error
            : "Unable to generate letter right now.";
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === company.id
              ? { ...c, status: "error", error: errorMsg }
              : c,
          ),
        );
        return "";
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === company.id ? { ...c, coverLetter: fullText } : c,
          ),
        );
      }

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id ? { ...c, status: "done" } : c,
        ),
      );

      return fullText;
    },
    [templateId],
  );

  async function handleGenerateAll() {
    const validCompanies = companies.filter(
      (c) => c.jobDescription.trim().length >= 40,
    );

    if (validCompanies.length === 0) {
      return;
    }

    setIsGeneratingAll(true);

    for (let i = 0; i < validCompanies.length; i++) {
      setCurrentGeneratingIndex(
        companies.findIndex((c) => c.id === validCompanies[i].id),
      );
      try {
        await generateForCompany(validCompanies[i]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") break;
      }
    }

    setIsGeneratingAll(false);
    setCurrentGeneratingIndex(-1);
  }

  function handleCancel() {
    abortRef.current?.abort();
    setIsGeneratingAll(false);
    setCurrentGeneratingIndex(-1);
  }

  const completedCompanies = companies.filter(
    (c) => c.status === "done" && c.coverLetter,
  );

  const validCount = companies.filter(
    (c) => c.jobDescription.trim().length >= 40,
  ).length;

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const handleCopyAll = useCallback(async () => {
    const allLetters = completedCompanies
      .map(
        (c) =>
          `${c.companyName ? `--- ${c.companyName} ---\n\n` : ""}${c.coverLetter}`,
      )
      .join("\n\n\n");
    await navigator.clipboard.writeText(allLetters);
  }, [completedCompanies]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Cover Letter Generator
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add companies and paste job descriptions. Generate all at once.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {validCount} of {companies.length} ready
          </Badge>
          {isGeneratingAll ? (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-destructive"
            >
              Cancel
            </Button>
          ) : (
            <Button
              onClick={handleGenerateAll}
              disabled={validCount === 0}
            >
              {companies.length > 1
                ? `Generate All (${validCount})`
                : "Generate"}
            </Button>
          )}
        </div>
      </div>

      {isGeneratingAll && currentGeneratingIndex >= 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${((currentGeneratingIndex + 1) / companies.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {currentGeneratingIndex + 1} / {companies.length}
            </span>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {companies.map((company, index) => (
          <Card key={company.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Input
                    value={company.companyName}
                    onChange={(e) =>
                      updateCompany(company.id, "companyName", e.target.value)
                    }
                    placeholder="Company name (optional)"
                    className="h-8 max-w-xs border-0 bg-transparent p-0 text-sm font-medium shadow-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {company.status === "generating" && (
                  <Badge variant="default">Generating...</Badge>
                )}
                {company.status === "done" && (
                  <Badge variant="success">Done</Badge>
                )}
                {company.status === "error" && (
                  <Badge variant="error">Error</Badge>
                )}
                {companies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCompany(company.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove company"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <Textarea
              value={company.jobDescription}
              onChange={(e) =>
                updateCompany(company.id, "jobDescription", e.target.value)
              }
              placeholder="Paste the full job description here..."
              className="mt-3 min-h-40"
            />

            {company.error && (
              <p className="mt-2 text-sm text-destructive">{company.error}</p>
            )}

            {company.jobDescription.trim().length > 0 &&
              company.jobDescription.trim().length < 40 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Need at least 40 characters ({company.jobDescription.trim().length}/40)
                </p>
              )}
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addCompany}
        className="w-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add Another Company
      </Button>

      {completedCompanies.length > 0 && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">
              Generated Letters
            </h3>
            {completedCompanies.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
              >
                Copy All
              </Button>
            )}
          </div>

          <Tabs
            defaultValue={completedCompanies[0]?.id ?? ""}
            className="w-full"
          >
            <TabsList className="mb-4">
              {completedCompanies.map((c) => (
                <TabsTrigger key={c.id} value={c.id}>
                  {c.companyName || `Company`}
                </TabsTrigger>
              ))}
            </TabsList>

            {completedCompanies.map((c) => (
              <TabsContent key={c.id} value={c.id} className="space-y-3">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {c.coverLetter.trim().split(/\s+/).length} words
                  </span>
                  <CopyButton
                    text={c.coverLetter}
                    onCopy={handleCopy}
                  />
                </div>
                <div className="rounded-md border border-dashed border-border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                    {c.coverLetter}
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      )}
    </div>
  );
}

function CopyButton({
  text,
  onCopy,
}: {
  text: string;
  onCopy: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="h-8 w-8"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </Button>
  );
}
