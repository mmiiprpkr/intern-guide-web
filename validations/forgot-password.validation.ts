import { z } from "zod";

export const forgotPasswordSchema = z.object({
   email: z
      .string()
      .email({ message: "กรุณากรอกอีเมลที่ถูกต้อง" })
      .trim(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
