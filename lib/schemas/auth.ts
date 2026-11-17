import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("This is not a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your full name"),
  email: z.string().email("This is not a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
