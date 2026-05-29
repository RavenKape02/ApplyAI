import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

import { clearResumeCache } from "@/lib/resume";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const RESUME_KEY = "resume:text";

export async function GET() {
  try {
    const text = await redis.get<string>(RESUME_KEY);
    if (!text) {
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch resume." },
      { status: 500 },
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

    await redis.set(RESUME_KEY, body.text);
    clearResumeCache();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update resume." },
      { status: 500 },
    );
  }
}
