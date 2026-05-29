"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch("/api/resume");
        if (res.ok) {
          const data = await res.json();
          setResumeText(data.text);
          setOriginalText(data.text);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    fetchResume();
  }, []);

  const hasChanges = resumeText !== originalText;

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      if (res.ok) {
        setOriginalText(resumeText);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [resumeText]);

  const wordCount = resumeText.trim()
    ? resumeText.trim().split(/\s+/).length
    : 0;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Resume Manager
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This is the resume the AI reads when generating cover letters. Edit
            it below and save.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{wordCount} words</Badge>
          {hasChanges && <Badge variant="warning">Unsaved</Badge>}
          {saveStatus === "saved" && <Badge variant="success">Saved</Badge>}
          {saveStatus === "error" && <Badge variant="error">Error</Badge>}
        </div>
      </div>

      <Card className="p-5">
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here..."
          className="min-h-[500px] font-mono text-sm"
        />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Stored in <code className="rounded bg-muted px-1 py-0.5">resume.md</code> at the project root.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setResumeText(originalText);
              }}
              disabled={!hasChanges}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
              disabled={!hasChanges}
            >
              Save Resume
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
