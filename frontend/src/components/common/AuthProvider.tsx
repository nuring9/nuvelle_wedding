"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { reissue } from "@/lib/api/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    hasHydrated,
    accessToken,
    refreshToken,
    isAuthenticated,
    setAuth,
    clearAuth,
  } = useAuthStore();

  useEffect(() => {
    // 새로고침 시 refreshToken으로 accessToken 재발급
    const restoreAuth = async () => {
      if (!hasHydrated) return;
      if (!isAuthenticated || !refreshToken) return;
      if (accessToken) return;

      try {
        const tokenResponse = await reissue({ refreshToken });
        setAuth(tokenResponse.accessToken, tokenResponse.refreshToken, {
          userId: tokenResponse.userId,
          name: tokenResponse.name,
          email: tokenResponse.email,
        });
      } catch {
        // refreshToken 만료 시 로그아웃 처리
        clearAuth();
      }
    };

    restoreAuth();
  }, [
    hasHydrated,
    isAuthenticated,
    accessToken,
    refreshToken,
    setAuth,
    clearAuth,
  ]);

  return <>{children}</>;
}
