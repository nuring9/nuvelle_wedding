import { AuthUser } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 인증 상태 타입 정의
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => void; // 로그인 상태 저장 함수
  clearAuth: () => void; // 로그아웃 상태 초기화 함수
  setAccessToken: (accessToken: string) => void; // access token만 갱신하는 함수
}

// 인증 전역 store 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),
    }),

    {
      name: "nuvelle-auth",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
