import { z } from "zod";

export const coverLetterRequestSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(40, "Job description is too short.")
    .max(12000, "Job description is too long."),
});

export type CoverLetterRequest = z.infer<typeof coverLetterRequestSchema>;
