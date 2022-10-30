import { z } from "zod";

export const uploadResponseSchema = z.object({
  bucket: z.string().min(1),
  filePath: z.string().min(1),
});
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
