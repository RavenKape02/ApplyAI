import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CoverLetterGenerator } from "@/features/cover-letter/components/cover-letter-generator";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            ApplyAI
          </h1>
          <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
            Paste a job description and get a concise, personalized cover letter
            powered by your resume.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <CoverLetterGenerator />
    </main>
  );
}
