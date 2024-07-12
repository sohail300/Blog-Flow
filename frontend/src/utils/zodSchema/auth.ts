import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .max(30, "Name should be between 1 to 30 characters")
    .min(1, "Name should be between 1 to 30 characters"),
  email: z
    .string()
    .email("Please provide a valid email")
    .max(30, "Email should be between 1 to 30 characters")
    .min(1, "Email should be between 1 to 30 characters"),
  password: z
    .string()
    .max(20, "Password should be between 6 to 20 characters")
    .min(6, "Password should be between 6 to 20 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
      "Password must contain both letters and numbers"
    ),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password cannot be empty"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP cant be empty")
    .max(6, "OTP can only be of 6 digits"),
});

export type signupType = z.infer<typeof signupSchema>;
export type signinType = z.infer<typeof signinSchema>;
export type otpType = z.infer<typeof otpSchema>;
