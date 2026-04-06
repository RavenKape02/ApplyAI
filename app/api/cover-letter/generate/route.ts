import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";

import { coverLetterRequestSchema } from "@/features/cover-letter/schema";
import { COVER_LETTER_PROMPT } from "@/lib/prompt";
import { getResumeText } from "@/lib/resume";

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

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY in environment." },
        { status: 500 },
      );
    }

    const resumeText = await getResumeText();

    // Static prefix (system message) — cached by Groq across requests.
    // Dynamic suffix (user message) — changes per JD.
    const result = streamText({
      model: groq("openai/gpt-oss-safeguard-20b"),
      system: `${COVER_LETTER_PROMPT}\n\nResume (plain text reference):\n${resumeText}`,
      prompt: `Job Description:\n${parsed.data.jobDescription}\n\nOutput only the final 3-paragraph cover letter body. Do not include any greeting, subject line, or sign-off.`,
    });

    return result.toTextStreamResponse();
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while generating cover letter." },
      { status: 500 },
    );
  }
}
