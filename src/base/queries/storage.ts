import { Upload } from "@/base/dto/Upload";

import { apiClient } from "@/common/providers/apiClient";

export const uploadFileToBucket = async (upload: Upload) => {
  const { error } = { error: "unimplemented" };

  const data = new FormData();
  data.append("bucket", upload.bucket);
  data.append("path", upload.filePath);
  data.append("media", upload.file);

  const result = await apiClient.post({
    url: "/api/files/upload",
    body: data,
    headers: {},
  });

  return { error };
};
