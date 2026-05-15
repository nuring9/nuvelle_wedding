"use client";

import { useAuthStore } from "@/stores/authStore";
import { LoginRequest, SignupRequest } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup, login, logout } from "@/lib/api/auth";

export function useAuth() {
  const router = useRouter();

  const { setAuth, clearAuth, accessToken, user, isAuthenticated } =
    useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      });

      router.push("/templates");
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
  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const tokenResponse = await login(data);

      // 응답받은 토큰과 사용자 정보를 전역 store에 저장
      setAuth(tokenResponse.accessToken, tokenResponse.refreshToken, {
        userId: tokenResponse.userId,
        name: tokenResponse.name,
        email: tokenResponse.email,
      });

      router.push("/templates");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인에 실패했습니다.");
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
    clearError: () => setError(null), // 에러 초기화 함수.
  };
}
