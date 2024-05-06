import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    phoneNumber: z.string().min(1).max(20).regex(/^\d+$/),
  });

  static readonly LOGIN: ZodType = z.object({
    password: z.string().min(1).max(100),
    phoneNumber: z.string().min(1).max(20).regex(/^\d+$/),
  });
}
