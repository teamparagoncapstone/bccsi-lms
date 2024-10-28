import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const moduleSchema = z.object({
  id: z.string(),
  moduleTitle: z.string(),
  moduleDescription: z.string(),
  learnOutcome1: z.string(),
  videoModule: z.string(),
  imageModule: z.string(),
  subjects: z.string(),
  grade: z.string()
});

export type student = z.infer<typeof moduleSchema>;