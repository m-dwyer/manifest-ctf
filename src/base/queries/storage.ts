import { Upload } from "@/base/schemas/upload";

import { apiClient } from "@/common/providers/apiClient";

export const uploadFileToBucket = async (upload: Upload) => {
  const { error } = { error: "unimplemented" };

  console.log("do the thing!: ", upload);

  const data = new FormData();
  data.append("media", upload.file);

  const result = await apiClient.post({
    url: "/api/files/upload",
    body: data,
    headers: {},
  });

  return { error };
};
