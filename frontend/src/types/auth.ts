// 회원가입 요청
export interface SignupRequest {
  email: string;
  password: string;
  name: string; // 사용자 이름
}

// 로그인 요청
export interface LoginRequest {
  email: string;
  password: string;
}

// 토큰 재발급 요청
export interface ReissueRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// 토큰 응답
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

// 프론트에서 관리할 사용자 정보
//  화면에서 필요한 사용자 정보만
export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

// 백엔드 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}
