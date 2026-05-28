"use client";

import { useAuth } from "@/hooks/userAuth";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { handleLogout, isLoading } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        transparent ? "bg-transparent" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="text-xl font-display font-semibold text-gray-800 tracking-widest"
        >
          Nuvelle
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-2">
          <Link
            href="/templates"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            청첩장 템플릿
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === "ROLE_ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-primary-600 hover:text-primary-800 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  관리자
                </Link>
              )}
              <Link
                href="/invitations"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                내청첩장
              </Link>
              <Link
                href="/honeymoon"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                신혼여행 플래너
              </Link>
              <div className="flex items-center gap-2 ml-1">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {user?.name}님
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  title="로그아웃"
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline text-xs">로그아웃</span>
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm px-4 py-2">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
