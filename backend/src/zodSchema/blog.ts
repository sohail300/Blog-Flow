import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .min(1, "The title should be between 1 and 50 characters")
    .max(50, "The title should be between 1 and 50 characters"),
  content: z
    .string()
    .min(50, "The title should be between 50 and 5000 characters")
    .max(5000, "The title should be between 50 and 5000 characters"),
  photourl: z.string().optional(),
});

export const publishSchema = z.object({
  publish: z.boolean(),
});

export type blogType = z.infer<typeof blogSchema>;
export type publishType = z.infer<typeof publishSchema>;
