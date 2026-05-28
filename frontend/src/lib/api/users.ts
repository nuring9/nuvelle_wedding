import axios from "axios";
import type { ApiResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getUserApi(accessToken: string) {
  return axios.create({
    baseURL: `${BASE_URL}/api/users`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function withdrawMe(
  confirmText: string,
  accessToken: string,
): Promise<void> {
  const api = getUserApi(accessToken);
  await api.patch<ApiResponse<void>>("/me/withdraw", { confirmText });
}
