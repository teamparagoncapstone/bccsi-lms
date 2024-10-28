import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const studentSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  middlename: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  image: z.string(),
  studentUsername: z.string(),
  studentPassword: z.string(),
  sex: z.string(),
  age: z.string()

});

export type Student = z.infer<typeof studentSchema>;