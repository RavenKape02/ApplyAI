import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const RESUME_KEY = "resume:text";

let cachedResume: string | null = null;

export async function getResumeText(): Promise<string> {
  if (cachedResume) {
    return cachedResume;
  }

  const resumeText = await redis.get<string>(RESUME_KEY);
  if (!resumeText) {
    throw new Error("Resume not found in storage");
  }
  cachedResume = resumeText;
  return resumeText;
}

export function clearResumeCache(): void {
  cachedResume = null;
}
