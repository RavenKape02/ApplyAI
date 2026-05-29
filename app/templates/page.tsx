"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates, type Template } from "@/lib/templates";

export default function TemplatesPage() {
  const [selectedId, setSelectedId] = useState(() => {
    try {
      return (
        (typeof window !== "undefined" &&
          localStorage.getItem("selected-template")) ||
        "loyal"
      );
    } catch {
      return "loyal";
    }
  });

  function handleSelect(id: string) {
    setSelectedId(id);
    localStorage.setItem("selected-template", id);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a cover letter style. This will be used for all generations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedId === template.id}
            onSelect={() => handleSelect(template.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`cursor-pointer p-5 transition-all hover:shadow-md ${
        isSelected
          ? "border-primary/50 ring-2 ring-primary/20"
          : "hover:border-border"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-card-foreground">{template.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
        {isSelected && (
          <Badge variant="default">Active</Badge>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="mt-3 text-xs text-primary hover:underline"
      >
        {expanded ? "Hide prompt" : "View prompt"}
      </button>

      {expanded && (
        <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
          {template.prompt}
        </pre>
      )}
    </Card>
  );
}
