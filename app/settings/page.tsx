"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const [model, setModel] = useState("groq");

  useEffect(() => {
    const stored = localStorage.getItem("selected-model");
    if (stored === "groq" || stored === "openrouter") {
      setModel(stored);
    }
  }, []);

  function handleModelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setModel(value);
    localStorage.setItem("selected-model", value);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your preferences.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground">Appearance</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Toggle between light and dark mode.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground">
                AI Model
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose which AI model to use for generating cover letters.
              </p>
            </div>
            <select
              value={model}
              onChange={handleModelChange}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            >
              <option value="groq">Groq (Llama)</option>
              <option value="openrouter">OpenRouter (Gemma)</option>
            </select>
          </div>
          {model === "openrouter" && (
            <div className="mt-3 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
              OpenRouter uses your{" "}
              <code className="rounded bg-muted px-1">OPENROUTER_API_KEY</code>{" "}
              environment variable. Configure it in your Vercel project
              settings.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground">
                API Configuration
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The Groq API key is configured server-side via the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  GROQ_API_KEY
                </code>{" "}
                environment variable.
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              Server-side
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div>
            <h3 className="font-medium text-card-foreground">About</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ApplyAI generates personalized cover letters using your resume and
              job descriptions. Powered by Groq and OpenRouter AI.
            </p>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span>Version 0.1.0</span>
              <span>Next.js 16</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}