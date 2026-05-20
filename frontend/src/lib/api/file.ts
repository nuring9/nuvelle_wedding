import type { ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface FileUploadResponse {
  url: string;
  originalFilename: string;
  size: number;
}

// 파일 업로드
export async function uploadFile(
  file: File,
  directory: string,
  accessToken: string,
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${BASE_URL}/api/files/upload?directory=${encodeURIComponent(directory)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    },
  );

  const json: ApiResponse<FileUploadResponse> = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.message || "파일 업로드에 실패했습니다.");
  }

  return json.data;
}

// 파일 삭제
export async function deleteFile(
  fileUrl: string,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/files`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fileUrl }),
  });

  const json: ApiResponse<null> = await res.json();

  if (!json.success) {
    throw new Error(json.message || "파일 삭제에 실패했습니다.");
  }
}
