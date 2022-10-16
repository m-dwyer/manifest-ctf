import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Upload } from "@/base/schemas/upload";

export const uploadFileToBucket = async (upload: Upload) => {
  const { error } = await supabaseClient.storage
    .from(upload.bucket)
    .upload(upload.filePath, upload.file);

  return { error };
};
