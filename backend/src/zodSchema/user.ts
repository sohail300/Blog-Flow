import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z
    .string()
    .max(30, "Name should be between 1 to 30 characters")
    .min(1, "Name should be between 1 to 30 characters"),
});

export const emailSchema = z.object({
  email: z.string().email(),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .max(20, "Password should be between 6 to 20 characters")
    .min(6, "Password should be between 6 to 20 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      "Password must contain both letters and numbers"
    ),
  token: z.string(),
});

export type userUpdateType = z.infer<typeof userUpdateSchema>;
export type emailType = z.infer<typeof emailSchema>;
export type passwordType = z.infer<typeof passwordSchema>;
