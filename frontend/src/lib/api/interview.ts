import axios from "axios";
import type { ApiResponse } from "@/types/auth";
import type {
  WeddingInterviewRequest,
  WeddingInterviewResponse,
} from "@/types/interview";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthApi(accessToken: string) {
  return axios.create({
    baseURL: `${BASE_URL}/api/invitations`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// 웨딩 인터뷰 저장 (작성자)
export async function saveInterview(
  invitationId: number,
  data: WeddingInterviewRequest,
  accessToken: string,
): Promise<WeddingInterviewResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.put<ApiResponse<WeddingInterviewResponse>>(
    `/${invitationId}/interview`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "웨딩 인터뷰 저장에 실패했습니다.");
  }
  return res.data.data;
}

// 웨딩 인터뷰 조회 (공개)
export async function getInterview(
  invitationId: number,
): Promise<WeddingInterviewResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/invitations/${invitationId}/interview`,
    );
    const json: ApiResponse<WeddingInterviewResponse> = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// 웨딩 인터뷰 조회 (작성자)
export async function getInterviewForEditor(
  invitationId: number,
  accessToken: string,
): Promise<WeddingInterviewResponse | null> {
  try {
    const api = getAuthApi(accessToken);
    const res = await api.get<ApiResponse<WeddingInterviewResponse>>(
      `/${invitationId}/interview`,
    );
    return res.data.data ?? null;
  } catch {
    return null;
  }
}
