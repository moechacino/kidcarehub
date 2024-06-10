import { ZodType, z } from "zod";

export class ConsultantValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(50),
    phone: z.string().min(1).max(20),
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
    profession: z.string().min(1).max(30),
    photoProfileUrl: z.string().url(),
    alumnus: z.string().max(30).nullable(),
    strNumber: z.string().min(1).max(25),
    workPlace: z.string().max(30).nullable(),
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
