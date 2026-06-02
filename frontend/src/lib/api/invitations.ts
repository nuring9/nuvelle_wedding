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
  objectPosition: string;
}

// 계좌
export interface InvitationAccountInput {
  side: "GROOM" | "BRIDE" | string;
  label: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  remittanceLink?: string | null;
}

export interface UpdateInvitationRequest {
  title?: string;
  mainImageUrl?: string;
  mainOverlayText?: string;
  mainImagePosition?: string;
  groomName?: string;
  brideName?: string;
  groomPhone?: string;
  bridePhone?: string;
  contactEnabled?: boolean;
  groomIntroduction?: string;
  brideIntroduction?: string;
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
  accounts?: InvitationAccountInput[];
  parentsEnabled?: boolean;
  ddayEnabled?: boolean;
  theme?: string;
  fontFamily?: string;
  galleryLayout?: string;
  animationType?: string;
  bgmId?: number | null;
  remittanceLink?: string;
  interviewEnabled?: boolean;
  guestPhotoEnabled?: boolean;
  photoBannerEnabled?: boolean;
  photoBannerUrl?: string;
  photoBannerPosition?: string;
  calendarEnabled?: boolean;
  qrEnabled?: boolean;
  sectionOrder?: string[];
}

export interface InvitationResponse {
  id: number;
  templateId: number;
  templateName: string;
  slug: string;
  status: "DRAFT" | "PRIVATE" | "PUBLISHED";
  title: string | null;
  mainImageUrl: string | null;
  mainOverlayText: string | null;
  mainImagePosition: string | null;
  groomName: string | null;
  brideName: string | null;
  groomPhone: string | null;
  bridePhone: string | null;
  contactEnabled: boolean;
  groomIntroduction: string | null;
  brideIntroduction: string | null;
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
  accounts: InvitationAccountInput[];
  rsvpEnabled: boolean;
  guestbookEnabled: boolean;
  accountEnabled: boolean;
  parentsEnabled: boolean;
  ddayEnabled: boolean;
  theme: string | null;
  fontFamily: string | null;
  galleryLayout: string | null;
  animationType: string | null;
  bgmId: number | null;
  bgmUrl: string | null;
  bgmTitle: string | null;
  remittanceLink: string | null;
  interviewEnabled: boolean;
  guestPhotoEnabled: boolean;
  photoBannerEnabled: boolean;
  photoBannerUrl: string | null;
  photoBannerPosition: string | null;
  calendarEnabled: boolean;
  qrEnabled: boolean;
  galleries: GalleryImageResponse[];
  publicUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sectionOrder: string[];
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

// 갤러리 이미지 위치 수정
export async function updateGalleryImagePosition(
  invitationId: number,
  imageId: number,
  objectPosition: string,
  accessToken: string,
): Promise<GalleryImageResponse> {
  const api = getAuthApi(accessToken);
  const res = await api.patch<ApiResponse<GalleryImageResponse>>(
    `/${invitationId}/gallery/${imageId}/position`,
    { objectPosition },
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "위치 변경에 실패했습니다.");
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
