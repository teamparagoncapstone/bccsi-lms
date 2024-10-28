import { z } from "zod";

export const AnswerSchema = z.object({
  Option1: z.string(),
  Option2: z.string(),
  Option3: z.string(),
});

export const VoiceSchema = z.object({
  voice1: z.string(),
  voice2: z.string(),
  voice3: z.string()
})