import axios from "axios";
import type { ApiResponse } from "@/types/auth";
import type {
  HoneymoonPlanGenerateRequest,
  HoneymoonPlanUpdateRequest,
  HoneymoonPlanDayUpdateRequest,
  HoneymoonPlanResponse,
  HoneymoonPlanSummaryResponse,
  HoneymoonPlanDayResponse,
  HoneymoonChatMessage,
  HoneymoonChatRequest,
} from "@/types/honeymoon";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthApi(accessToken: string) {
  return axios.create({
    baseURL: `${BASE_URL}/api/honeymoon/plans`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  if (error instanceof Error) return error.message;

  return fallbackMessage;
}

// AI 일정 생성
export async function generatePlan(
  data: HoneymoonPlanGenerateRequest,
  accessToken: string,
): Promise<HoneymoonPlanResponse> {
  try {
    const api = getAuthApi(accessToken);
    const res = await api.post<ApiResponse<HoneymoonPlanResponse>>(
      "/generate",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "일정 생성에 실패했습니다.");
    }
    return res.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "일정 생성에 실패했습니다."));
  }
}

// 내 플랜 목록 조회
export async function getMyPlans(
  accessToken: string,
): Promise<HoneymoonPlanSummaryResponse[]> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<HoneymoonPlanSummaryResponse[]>>("");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "플랜 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// 플랜 상세 조회
export async function getPlan(
  planId: number,
  accessToken: string,
): Promise<HoneymoonPlanResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<HoneymoonPlanResponse>>(`/${planId}`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "플랜을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// 플랜 수정
export async function updatePlan(
  planId: number,
  data: HoneymoonPlanUpdateRequest,
  accessToken: string,
): Promise<HoneymoonPlanResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.patch<ApiResponse<HoneymoonPlanResponse>>(
    `/${planId}`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "플랜 수정에 실패했습니다.");
  }
  return res.data.data;
}

// 플랜 확정 (DRAFT → SAVED)
export async function savePlan(
  planId: number,
  accessToken: string,
): Promise<HoneymoonPlanResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.post<ApiResponse<HoneymoonPlanResponse>>(
    `/${planId}/save`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "플랜 확정에 실패했습니다.");
  }
  return res.data.data;
}

// 플랜 삭제
export async function deletePlan(
  planId: number,
  accessToken: string,
): Promise<void> {
  const api = getAuthApi(accessToken);
  await api.delete(`/${planId}`);
}

// Day별 일정 수정
export async function updatePlanDay(
  planId: number,
  dayId: number,
  data: HoneymoonPlanDayUpdateRequest,
  accessToken: string,
): Promise<HoneymoonPlanDayResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.patch<ApiResponse<HoneymoonPlanDayResponse>>(
    `/${planId}/days/${dayId}`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "일정 수정에 실패했습니다.");
  }
  return res.data.data;
}

// 챗봇 메시지 전송
export async function sendChatMessage(
  planId: number,
  data: HoneymoonChatRequest,
  accessToken: string,
): Promise<HoneymoonChatMessage> {
  try {
    const api = getAuthApi(accessToken);
    const res = await api.post<ApiResponse<HoneymoonChatMessage>>(
      `/${planId}/chat`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "메시지 전송에 실패했습니다.");
    }
    return res.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "메시지 전송에 실패했습니다."));
  }
}

// AI 채팅 변경안으로 새 플랜 생성
export async function createPlanFromChatSuggestion(
  planId: number,
  messageId: number,
  accessToken: string,
): Promise<HoneymoonPlanResponse> {
  try {
    const api = getAuthApi(accessToken);
    const res = await api.post<ApiResponse<HoneymoonPlanResponse>>(
      `/${planId}/chat/${messageId}/create-plan`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "새 일정 생성에 실패했습니다.");
    }
    return res.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "새 일정 생성에 실패했습니다."));
  }
}

// 대화 내역 조회
export async function getChatHistory(
  planId: number,
  accessToken: string,
): Promise<HoneymoonChatMessage[]> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<HoneymoonChatMessage[]>>(
    `/${planId}/chat`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "대화 내역을 불러오지 못했습니다.");
  }
  return res.data.data;
}
