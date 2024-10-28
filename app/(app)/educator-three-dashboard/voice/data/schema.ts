import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const QuestionsSchema = z.object({
  id: z.string(),
  image: z.string(),
  question: z.string(),
  Option1: z.string(),
  Option2: z.string(),
  Option3: z.string(),
  CorrectAnswers: z.string(),
  userId: z.string(),
  grade: z.string(),
  moduleId: z.string()
});

export type Module = z.infer<typeof QuestionsSchema>;