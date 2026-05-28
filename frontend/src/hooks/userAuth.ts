"use client";

import { useAuthStore } from "@/stores/authStore";
import { LoginRequest, SignupRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup, login, logout, kakaoLogin, LoginFieldError } from "@/lib/api/auth";

export function useAuth() {
  const router = useRouter();

  const { setAuth, clearAuth, accessToken, user, isAuthenticated } =
    useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDefaultRedirectPath = (role: "ROLE_USER" | "ROLE_ADMIN") => {
    return role === "ROLE_ADMIN" ? "/admin/templates" : "/templates";
  };

  // 회원가입
  const handleSignup = async (data: SignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokenResponse = await signup(data);

      // 응답받은 토큰과 사용자 정보를 전역 store에 저장
      setAuth(tokenResponse.accessToken, tokenResponse.refreshToken, {
        userId: tokenResponse.userId,
        name: tokenResponse.name,
        email: tokenResponse.email,
        role: tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN",
      });

      router.push(
        getDefaultRedirectPath(tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN"),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const handleLogin = async (
    data: LoginRequest,
  ): Promise<{ field: "email" | "password"; message: string } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const tokenResponse = await login(data);

      // 응답받은 토큰과 사용자 정보를 전역 store에 저장
      setAuth(tokenResponse.accessToken, tokenResponse.refreshToken, {
        userId: tokenResponse.userId,
        name: tokenResponse.name,
        email: tokenResponse.email,
        role: tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN",
      });

      router.push(
        getDefaultRedirectPath(tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN"),
      );
      return null;
    } catch (err: unknown) {
      if (err instanceof LoginFieldError) {
        return { field: err.field, message: err.message };
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인에 실패했습니다.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 페이지로 이동
  const startKakaoLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  // 카카오 콜백 처리 (code → JWT 발급)
  const handleKakaoCallback = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokenResponse = await kakaoLogin(code);

      setAuth(tokenResponse.accessToken, tokenResponse.refreshToken, {
        userId: tokenResponse.userId,
        name: tokenResponse.name,
        email: tokenResponse.email,
        role: tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN",
      });

      // replace로 콜백 페이지를 히스토리에서 제거 → 뒤로 가기 시 로그인 페이지로 이동
      router.replace(
        getDefaultRedirectPath(tokenResponse.role as "ROLE_USER" | "ROLE_ADMIN"),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("카카오 로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } catch {
      // 로그아웃 API가 실패해도 로컬 인증 상태는 초기화 되어서 비움.
    } finally {
      clearAuth(); // 전역 인증 상태 초기화
      router.push("/");
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    handleSignup,
    handleLogin,
    handleLogout,
    startKakaoLogin,
    handleKakaoCallback,
    clearError: () => setError(null),
  };
}
