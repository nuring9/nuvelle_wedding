import type { ApiResponse } from "@/types/auth";
import { apiClient } from "./apiClient";

export interface FileUploadResponse {
  url: string;
  originalFilename: string;
  size: number;
}

export async function uploadFile(
  file: File,
  directory: string,
  accessToken: string,
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ApiResponse<FileUploadResponse>>(
    `/api/files/upload?directory=${encodeURIComponent(directory)}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "파일 업로드에 실패했습니다.");
  }

  return res.data.data;
}

export async function deleteFile(
  fileUrl: string,
  accessToken: string,
): Promise<void> {
  const res = await apiClient.delete<ApiResponse<null>>(`/api/files`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    data: { fileUrl },
  });

  if (!res.data.success) {
    throw new Error(res.data.message || "파일 삭제에 실패했습니다.");
  }
}
