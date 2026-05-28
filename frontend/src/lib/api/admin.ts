import {
  AdminBgm,
  AdminBgmRequest,
  AdminInvitationSummary,
  AdminTemplate,
  AdminTemplateRequest,
  AdminUser,
  UserRole,
  UserStatus,
} from "@/types/admin";
import { ApiResponse } from "@/types/auth";
import axios from "axios";
import { InvitationResponse } from "./invitations";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAdminApi(accessToken: string) {
  return axios.create({
    baseURL: `${BASE_URL}/api/admin`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// 템플릿 전체 목록 (비활성 포함)
export async function getAdminTemplates(
  accessToken: string,
): Promise<AdminTemplate[]> {
  const api = getAdminApi(accessToken);
  const res = await api.get<ApiResponse<AdminTemplate[]>>("/templates");

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿 목록을 불러오지 못했습니다.");
  }

  return res.data.data;
}

// 템플릿 단건 조회
export async function getAdminTmplate(
  templateId: number,
  accessToken: string,
): Promise<AdminTemplate> {
  const api = getAdminApi(accessToken);
  const res = await api.get<ApiResponse<AdminTemplate>>(
    `/templates/${templateId}`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// 템플릿 생성
export async function createAdminTemplate(
  data: AdminTemplateRequest,
  accessToken: string,
): Promise<AdminTemplate> {
  const api = getAdminApi(accessToken);
  const res = await api.post<ApiResponse<AdminTemplate>>("/templates", data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿 생성에 실패했습니다.");
  }
  return res.data.data;
}

// 템플릿 수정
export async function updateAdminTemplate(
  templateId: number,
  data: Partial<AdminTemplateRequest>,
  accessToken: string,
): Promise<AdminTemplate> {
  const api = getAdminApi(accessToken);
  const res = await api.patch<ApiResponse<AdminTemplate>>(
    `/templates/${templateId}`,
    data,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿 수정에 실패했습니다.");
  }
  return res.data.data;
}

// 템플릿 삭제
export async function deleteAdminTemplate(
  templateId: number,
  accessToken: string,
): Promise<void> {
  const api = getAdminApi(accessToken);
  await api.delete(`/templates/${templateId}`);
}

// 마스터 청첩장 생성 또는 기존 반환
export async function getOrCreateMasterInvitation(
  templateId: number,
  accessToken: string,
): Promise<InvitationResponse> {
  const api = getAdminApi(accessToken);
  const res = await api.post<ApiResponse<InvitationResponse>>(
    `/templates/${templateId}/master-invitation`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "마스터 청첩장을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// BGM 전체 목록 (비활성 포함)
export async function getAdminBgms(accessToken: string): Promise<AdminBgm[]> {
  const api = getAdminApi(accessToken);
  const res = await api.get<ApiResponse<AdminBgm[]>>("/bgms");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "BGM 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

// BGM 등록
export async function createAdminBgm(
  data: AdminBgmRequest,
  accessToken: string,
): Promise<AdminBgm> {
  const api = getAdminApi(accessToken);
  const res = await api.post<ApiResponse<AdminBgm>>("/bgms", data);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "BGM 등록에 실패했습니다.");
  }
  return res.data.data;
}

// BGM 수정
export async function updateAdminBgm(
  bgmId: number,
  data: Partial<AdminBgmRequest>,
  accessToken: string,
): Promise<AdminBgm> {
  const api = getAdminApi(accessToken);
  const res = await api.patch<ApiResponse<AdminBgm>>(`/bgms/${bgmId}`, data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "BGM 수정에 실패했습니다.");
  }

  return res.data.data;
}

// BGM 삭제
export async function deleteAdminBgm(
  bgmId: number,
  accessToken: string,
): Promise<void> {
  const api = getAdminApi(accessToken);
  await api.delete(`/bgms/${bgmId}`);
}

// 발행된 청첩장 목록
export async function getAdminInvitations(
  accessToken: string,
): Promise<AdminInvitationSummary[]> {
  const api = getAdminApi(accessToken);
  const res =
    await api.get<ApiResponse<AdminInvitationSummary[]>>("/invitations");
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "청첩장 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

export async function getAdminUsers(
  accessToken: string,
  params?: { keyword?: string; status?: UserStatus | "" },
): Promise<AdminUser[]> {
  const api = getAdminApi(accessToken);
  const res = await api.get<ApiResponse<AdminUser[]>>("/users", { params });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

export async function getAdminUser(
  userId: number,
  accessToken: string,
): Promise<AdminUser> {
  const api = getAdminApi(accessToken);
  const res = await api.get<ApiResponse<AdminUser>>(`/users/${userId}`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원 정보를 불러오지 못했습니다.");
  }
  return res.data.data;
}

export async function updateAdminUserStatus(
  userId: number,
  status: UserStatus,
  accessToken: string,
): Promise<AdminUser> {
  const api = getAdminApi(accessToken);
  const res = await api.patch<ApiResponse<AdminUser>>(`/users/${userId}/status`, {
    status,
  });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원 상태 변경에 실패했습니다.");
  }
  return res.data.data;
}

export async function updateAdminUserRole(
  userId: number,
  role: UserRole,
  accessToken: string,
): Promise<AdminUser> {
  const api = getAdminApi(accessToken);
  const res = await api.patch<ApiResponse<AdminUser>>(`/users/${userId}/role`, {
    role,
  });
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원 권한 변경에 실패했습니다.");
  }
  return res.data.data;
}

export async function withdrawAdminUser(
  userId: number,
  accessToken: string,
): Promise<AdminUser> {
  const api = getAdminApi(accessToken);
  const res = await api.patch<ApiResponse<AdminUser>>(`/users/${userId}/withdraw`);
  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원 탈퇴 처리에 실패했습니다.");
  }
  return res.data.data;
}
