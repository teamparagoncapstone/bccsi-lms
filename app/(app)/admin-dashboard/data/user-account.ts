import { z } from "zod"

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    password:z.string(),
    email: z.string(),
    role: z.string(),
    image: z.string()
  });
  
  export type Student = z.infer<typeof UserSchema>;