import { Upload } from "@/base/dto/Upload";
import { ResponseWithData } from "@/common/dto/ResponseWithData";

import { apiClient } from "@/common/providers/apiClient";
import { UploadResponse } from "../dto/UploadResponse";

export const uploadFileToBucket = async (
  upload: Upload
): Promise<ResponseWithData<UploadResponse[]>> => {
  const data = new FormData();
  data.append("bucket", upload.bucket);
  data.append("path", upload.filePath);
  data.append("media", upload.file);

  const result = await apiClient.post<UploadResponse[]>({
    url: "/api/files/upload",
    body: data,
    headers: {},
  });

  return { success: true, data: result.data };
};
