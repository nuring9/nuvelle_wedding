import axios from "axios";
import type { ApiResponse } from "@/types/auth";

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

export interface CreateInvitationRequest {
  templateId: number;
  title?: string;
}

export interface GalleryImageResponse {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

export interface UpdateInvitationRequest {
  title?: string;
  mainImageUrl?: string;
  groomName?: string;
  brideName?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  greetingText?: string;
  weddingDate?: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueDetail?: string;
  transportInfo?: string;
  mapLat?: number;
  mapLng?: number;
  accountBank?: string;
  accountNumber?: string;
  accountHolder?: string;
  galleryEnabled?: boolean;
  rsvpEnabled?: boolean;
  guestbookEnabled?: boolean;
  accountEnabled?: boolean;
  parentsEnabled?: boolean;
  ddayEnabled?: boolean;
  theme?: string;
  fontFamily?: string;
  galleryLayout?: string;
  animationType?: string;
  bgmUrl?: string;
}

export interface InvitationResponse {
  id: number;
  templateId: number;
  templateName: string;
  slug: string;
  status: "DRAFT" | "PRIVATE" | "PUBLISHED";
  title: string | null;
  mainImageUrl: string | null;
  groomName: string | null;
  brideName: string | null;
  groomFatherName: string | null;
  groomMotherName: string | null;
  brideFatherName: string | null;
  brideMotherName: string | null;
  greetingText: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueDetail: string | null;
  transportInfo: string | null;
  mapLat: number | null;
  mapLng: number | null;
  accountBank: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  galleryEnabled: boolean;
  rsvpEnabled: boolean;
  guestbookEnabled: boolean;
  accountEnabled: boolean;
  parentsEnabled: boolean;
  ddayEnabled: boolean;
  theme: string | null;
  fontFamily: string | null;
  galleryLayout: string | null;
  animationType: string | null;
  bgmUrl: string | null;
  galleries: GalleryImageResponse[];
  publicUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationSummaryResponse {
  id: number;
  templateName: string;
  slug: string;
  status: "DRAFT" | "PRIVATE" | "PUBLISHED";
  title: string | null;
  mainImageUrl: string | null;
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// 청첩장 생성
export async function createInvitation(
  data: CreateInvitationRequest,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.post<ApiResponse<InvitationResponse>>("", data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "청첩장 생성에 실패했습니다.");
  }
  return res.data.data;
}

// 내 청첩장 목록
export async function getMyInvitations(
  accessToken: string,
): Promise<InvitationSummaryResponse[]> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<InvitationSummaryResponse[]>>("");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "청첩장 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// 청첩장 단건 조회
export async function getInvitation(
  invitationId: number,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<InvitationResponse>>(
    `/${invitationId}`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "청첩장을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// 청첩장 수정 (임시저장)
export async function updateInvitation(
  invitationId: number,
  data: UpdateInvitationRequest,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.patch<ApiResponse<InvitationResponse>>(
    `/${invitationId}`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "저장에 실패했습니다.");
  }
  return res.data.data;
}

// 발행
export async function publishInvitation(
  invitationId: number,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.post<ApiResponse<InvitationResponse>>(
    `/${invitationId}/publish`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "발행에 실패했습니다.");
  }
  return res.data.data;
}

// 비공개
export async function makePrivateInvitation(
  invitationId: number,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.post<ApiResponse<InvitationResponse>>(
    `/${invitationId}/private`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "비공개 전환에 실패했습니다.");
  }
  return res.data.data;
}

// 삭제
export async function deleteInvitation(
  invitationId: number,
  accessToken: string,
): Promise<void> {
  const api = getAuthApi(accessToken);
  await api.delete(`/${invitationId}`);
}

// 갤러리 이미지 추가
export async function addGalleryImage(
  invitationId: number,
  imageUrl: string,
  accessToken: string,
): Promise<GalleryImageResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.post<ApiResponse<GalleryImageResponse>>(
    `/${invitationId}/gallery`,
    { imageUrl },
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "이미지 추가에 실패했습니다.");
  }
  return res.data.data;
}

// 갤러리 이미지 삭제
export async function deleteGalleryImage(
  invitationId: number,
  imageId: number,
  accessToken: string,
): Promise<void> {
  const api = getAuthApi(accessToken);
  await api.delete(`/${invitationId}/gallery/${imageId}`);
}
