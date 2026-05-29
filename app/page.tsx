import { CoverLetterGenerator } from "@/features/cover-letter/components/cover-letter-generator";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <CoverLetterGenerator />
    </div>
  );
}
