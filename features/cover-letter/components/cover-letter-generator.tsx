"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const wordCount = useMemo(() => {
    const trimmed = coverLetter.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [coverLetter]);

  const handleCopy = useCallback(async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [coverLetter]);

  async function handleGenerate() {
    setError("");
    setCoverLetter("");

    if (jobDescription.trim().length < 40) {
      setError(
        "Please paste a more detailed job description (at least 40 characters).",
      );
      return;
    }

    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(
          typeof data.error === "string"
            ? data.error
            : "Unable to generate letter right now.",
        );
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setCoverLetter((prev) => prev + chunk);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground">
          Job Description
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the full JD below. ApplyAI will write a 3-paragraph cover letter
          capped at ~200 words.
        </p>

        <label className="sr-only" htmlFor="job-description">
          Job description
        </label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full role description here..."
          className="mt-4 min-h-64"
        />

        <Button
          type="button"
          onClick={handleGenerate}
          isLoading={isLoading}
          loadingText="Generating..."
          className="mt-4 w-full sm:w-auto"
        >
          Generate Cover Letter
        </Button>

        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </Card>

      <Card className="flex flex-col p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">
            Cover Letter
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-muted-foreground">
              {wordCount} words
            </span>
            {coverLetter && (
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
            )}
          </div>
        </div>

        <div className="mt-4 flex-1 rounded-md border border-dashed border-border bg-muted/30 p-4">
          {isLoading && !coverLetter ? (
            <div className="space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ) : coverLetter ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {coverLetter}
              {isLoading && (
                <span className="ml-0.5 inline-block animate-blink text-primary">
                  ▌
                </span>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your generated cover letter will appear here.
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}
