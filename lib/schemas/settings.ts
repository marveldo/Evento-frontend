import { z } from "zod";
import { imageFile } from "@/lib/schemas/event";

const optionalHttpsUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https:\/\/.+/.test(value), "URL must start with https://");

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Cannot be less than 2 letters"),
  bio: z.string().trim(),
  picture: imageFile.optional(),
});

export const socialSchema = z.object({
  website: optionalHttpsUrl,
  twitter: optionalHttpsUrl,
  facebook: optionalHttpsUrl,
  instagram: optionalHttpsUrl,
});

export const passwordSchema = z
  .object({
    new_password: z.string().min(8, "Password cannot be less than 8 characters").max(128),
    confirm_new_password: z.string(),
  })
  .refine((v) => v.new_password === v.confirm_new_password, {
    path: ["confirm_new_password"],
    message: "Passwords don't match",
  });

export type ProfileValues = z.infer<typeof profileSchema>;
export type SocialValues = z.infer<typeof socialSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
