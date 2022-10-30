import { z } from "zod";

export const uploadSchema = z.object({
  bucket: z.string().min(1),
  filePath: z.string().min(1),
  file: z.instanceof(File),
});
export type Upload = z.infer<typeof uploadSchema>;
