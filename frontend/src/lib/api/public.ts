import axios from "axios";
import type { ApiResponse } from "@/types/auth";
import type {
  GuestbookRequest,
  GuestbookResponse,
  PublicInvitation,
  RsvpRequest,
  RsvpResponse,
} from "@/types/invitation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const publicApi = axios.create({
  baseURL: `${BASE_URL}/api/public/invitations`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 공개 청첩장 조회
export async function getPublicInvitation(
  slug: string,
): Promise<PublicInvitation> {
  const res = await publicApi.get<ApiResponse<PublicInvitation>>(`/${slug}`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "청첩장을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// RSVP 등록
export async function submitRsvp(
  slug: string,
  data: RsvpRequest,
): Promise<RsvpResponse> {
  const res = await publicApi.post<ApiResponse<RsvpResponse>>(
    `/${slug}/rsvp`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "RSVP 등록에 실패했습니다.");
  }
  return res.data.data;
}

// 방명록 등록
export async function submitGuestbook(
  slug: string,
  data: GuestbookRequest,
): Promise<GuestbookResponse> {
  const res = await publicApi.post<ApiResponse<GuestbookResponse>>(
    `/${slug}/guestbook`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "방명록 등록에 실패했습니다.");
  }
  return res.data.data;
}

// 공개 방명록 목록 조회
export async function getGuestbookList(
  slug: string,
): Promise<GuestbookResponse[]> {
  const res = await publicApi.get<ApiResponse<GuestbookResponse[]>>(
    `/${slug}/guestbook`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "방명록을 불러오지 못했습니다.");
  }
  return res.data.data;
}
