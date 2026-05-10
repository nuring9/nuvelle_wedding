import {
  ApiResponse,
  LoginRequest,
  ReissueRequest,
  SignupRequest,
  TokenResponse,
} from "@/types/auth";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// 인증 API 요청에 공통으로 사용할 axios 인스턴스 생성.
const authApi = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 회원가입 API 호출
export async function signup(data: SignupRequest): Promise<TokenResponse> {
  // POST /api/auth/signup 요청

  const res = await authApi.post<ApiResponse<TokenResponse>>("/signup", data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "회원가입에 실패했습니다.");
  }

  return res.data.data;
}

// 로그인 API
export async function login(data: LoginRequest): Promise<TokenResponse> {
  // POST /api/auth/login 요청
  const res = await authApi.post<ApiResponse<TokenResponse>>("/login", data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "로그인에 실패했습니다.");
  }

  return res.data.data;
}

// 토큰 재발급 API
export async function reissue(data: ReissueRequest): Promise<TokenResponse> {
  // POST /api/auth/reissue 요청
  const res = await authApi.post<ApiResponse<TokenResponse>>("/reissue", data);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "로그인에 실패했습니다.");
  }

  return res.data.data;
}

// 로그아웃 API 호출 함수
export async function logout(accessToken: string): Promise<void> {
  // POST /api/auth/logout 요청
  await authApi.post(
    "/logout", // 요청주소
    {}, // body 비움
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, //
      },
    },
  );
}
