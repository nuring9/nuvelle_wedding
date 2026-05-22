import type { ApiResponse } from "@/types/auth";
import type { BgmResponse } from "@/types/bgm";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getBgms(): Promise<BgmResponse[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/bgms`);
    const json: ApiResponse<BgmResponse[]> = await res.json();
    if (!json.success || !json.data) return [];
    return json.data;
  } catch {
    return [];
  }
}
