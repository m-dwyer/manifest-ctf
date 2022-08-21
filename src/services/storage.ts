import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const uploadFileToBucket = async (
  bucket: string,
  filePath: string,
  file: File
) => {
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(filePath, file);

  return { error };
};
