import { z } from "zod";

export const coverLetterRequestSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(40, "Job description is too short.")
    .max(12000, "Job description is too long."),
  companyName: z.string().trim().optional(),
  templateId: z.string().trim().optional(),
});

export type CoverLetterRequest = z.infer<typeof coverLetterRequestSchema>;

export type CompanyEntry = {
  id: string;
  companyName: string;
  jobDescription: string;
  coverLetter: string;
  status: "idle" | "generating" | "done" | "error";
  error?: string;
};
