import axios from "axios";
import type { ApiResponse } from "@/types/auth";
import type { RsvpResponse } from "@/types/invitation";

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

export async function getRsvpList(
  invitationId: number,
  accessToken: string,
): Promise<RsvpResponse[]> {
  const api = getAuthApi(accessToken);
  const res = await api.get<ApiResponse<RsvpResponse[]>>(
    `/${invitationId}/rsvps`,
  );
  if (!res.data.success || !res.data.data) {
    throw new Error(
      res.data.message || "참석 여부 목록을 불러오지 못했습니다.",
    );
  }
  return res.data.data;
}
