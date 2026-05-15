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
            href="templates"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            청첩장 템플릿
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/invitations"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                내청첩장
              </Link>
              <div className="flex items-center gap-2 ml-1">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {user?.name}님
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  로그아웃
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
