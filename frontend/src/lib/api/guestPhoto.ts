import type { ApiResponse } from "@/types/auth";
import type { GuestPhotoResponse } from "@/types/guestPhoto";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 게스트 사진 업로드 (공개)
export async function uploadGuestPhoto(
  slug: string,
  file: File,
  uploaderName?: string,
  message?: string,
): Promise<GuestPhotoResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (uploaderName) formData.append("uploaderName", uploaderName);
  if (message) formData.append("message", message);

  const res = await fetch(
    `${BASE_URL}/api/public/invitations/${slug}/guest-photos`,
    {
      method: "POST",
      body: formData,
    },
  );
  const json: ApiResponse<GuestPhotoResponse> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || "사진 업로드에 실패했습니다.");
  }
  return json.data;
}

// 게스트 사진 목록 조회 (공개)
export async function getGuestPhotos(
  slug: string,
): Promise<GuestPhotoResponse[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/public/invitations/${slug}/guest-photos`,
    );
    const json: ApiResponse<GuestPhotoResponse[]> = await res.json();
    if (!json.success || !json.data) return [];
    return json.data;
  } catch {
    return [];
  }
}
