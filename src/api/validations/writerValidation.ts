import { ZodType, z } from "zod";

export class WriterValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    phone: z.string().min(1).max(20).regex(/^\d+$/),
    email: z.string().email().min(1).max(100),
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });

  static readonly CHANGE_PASSWORD: ZodType = z.object({
    password: z.string().min(1).max(100),
    newPassword: z.string().min(1).max(100),
  });
}
