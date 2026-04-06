# ApplyAI

ApplyAI helps you write a cover letter faster.

You paste a job description, then the app uses your resume as context and generates a short 3-paragraph cover letter.

## What The App Does

- Takes a job description from the user.
- Loads `resume.md` as plain-text reference.
- Sends both to Groq using a fixed writing prompt.
- Streams the output back in real time.
- Returns a concise cover letter (target: up to 200 words).

## Project Specs

- Framework: Next.js 16 (App Router)
- UI: React 19.2
- Styling: Tailwind CSS v4 (`@theme` tokens)
- Runtime: Node.js 22.x
- AI SDK: Vercel AI SDK (`ai`, `@ai-sdk/groq`)
- AI Provider: Groq
- Model: `openai/gpt-oss-safeguard-20b`

## Prompt Rules Used

The generation prompt enforces:

- 3 short paragraphs
- Human and professional tone
- Simple wording (no AI-sounding buzzwords)
- Proof-based writing from real projects in the resume
- Clear close with a call to chat

## Prompt Caching Strategy (Groq)

To improve speed and cost:

- Static content is sent in `system`:
  - fixed instructions
  - full `resume.md` text
- Dynamic content is sent in `prompt`:
  - current job description

This structure improves Groq prompt cache hits because the stable prefix stays the same across requests.

## Current Features

- Job description input
- Streamed response UI
- Word count display
- One-click copy button
- Dark mode toggle
- Loading skeleton while generating

## Folder Structure

```txt
app/
  api/cover-letter/generate/route.ts
  globals.css
  layout.tsx
  page.tsx

components/
  ui/
    button.tsx
    card.tsx
    textarea.tsx
    theme-toggle.tsx

features/
  cover-letter/
    components/cover-letter-generator.tsx
    schema.ts

lib/
  prompt.ts
  resume.ts

resume.md
```

## Environment Variables

Create `.env` with:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.