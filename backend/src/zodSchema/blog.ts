import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const imageSchema = z.object({
  photo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than or equal to 10 MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported."
    ),
});

export const blogSchema = z.object({
  title: z
    .string()
    .min(1, "The title should be between 1 and 100 characters")
    .max(100, "The title should be between 1 and 100 characters"),
  content: z
    .string()
    .min(20, "The content should be between 20 and 20000 characters")
    .max(20000, "The content should be between 20 and 20000 characters"),
  photo: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than or equal to 10 MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported."
    )
    .optional(),
});

export const publishSchema = z.object({
  publish: z.boolean(),
});

export type blogType = z.infer<typeof blogSchema>;
export type publishType = z.infer<typeof publishSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
