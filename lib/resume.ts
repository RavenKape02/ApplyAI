import { readFile } from "node:fs/promises";
import path from "node:path";

let cachedResume: string | null = null;

export async function getResumeText(): Promise<string> {
  if (cachedResume) {
    return cachedResume;
  }

  const resumePath = path.join(process.cwd(), "resume.md");
  const resumeText = await readFile(resumePath, "utf8");
  cachedResume = resumeText;
  return resumeText;
}

export function clearResumeCache(): void {
  cachedResume = null;
}
