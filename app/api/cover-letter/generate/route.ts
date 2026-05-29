import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";

import { coverLetterRequestSchema } from "@/features/cover-letter/schema";
import { getTemplateById } from "@/lib/templates";
import { getResumeText } from "@/lib/resume";

type Message = { role: "system" | "user"; content: string };

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = coverLetterRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const resumeText = await getResumeText();
    const template = getTemplateById(parsed.data.templateId ?? "loyal");
    const companyContext = parsed.data.companyName
      ? `\n\nCompany: ${parsed.data.companyName}`
      : "";

    const model = parsed.data.model ?? "groq";

    if (model === "openrouter") {
      if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json(
          { error: "Missing OPENROUTER_API_KEY in environment." },
          { status: 500 },
        );
      }

      const messages: Message[] = [
        {
          role: "system",
          content: `${template.prompt}\n\nResume (plain text reference):\n${resumeText}`,
        },
        {
          role: "user",
          content: `Job Description:\n${parsed.data.jobDescription}${companyContext}\n\nOutput only the final cover letter body paragraphs. Do not include any greeting, subject line, or sign off.`,
        },
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemma-4-31b-it:free",
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json(
          { error: `OpenRouter API error: ${errorData}` },
          { status: 500 },
        );
      }

      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
        },
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY in environment." },
        { status: 500 },
      );
    }

    const result = streamText({
      model: groq("openai/gpt-oss-safeguard-20b"),
      system: `${template.prompt}\n\nResume (plain text reference):\n${resumeText}`,
      prompt: `Job Description:\n${parsed.data.jobDescription}${companyContext}\n\nOutput only the final cover letter body paragraphs. Do not include any greeting, subject line, or sign off.`,
    });

    return result.toTextStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while generating cover letter." },
      { status: 500 },
    );
  }
}