import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { clearResumeCache } from "@/lib/resume";

const resumePath = path.join(process.cwd(), "resume.md");

export async function GET() {
  try {
    const text = await readFile(resumePath, "utf8");
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Resume file not found." },
      { status: 404 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Invalid payload. 'text' field is required." },
        { status: 400 },
      );
    }

    await writeFile(resumePath, body.text, "utf8");
    clearResumeCache();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update resume." },
      { status: 500 },
    );
  }
}
