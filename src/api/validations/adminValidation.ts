import { ZodType, z } from "zod";

export class AdminValidation {
  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}
