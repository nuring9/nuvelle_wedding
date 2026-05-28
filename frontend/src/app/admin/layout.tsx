"use client";

import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/userAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasHydrated, isAuthenticated } = useAuthStore();
  const { handleLogout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated || !user || user.role !== "ROLE_ADMIN") {
      router.replace("/");
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  if (!hasHydrated || !isAuthenticated || !user || user.role !== "ROLE_ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin/templates" className="leading-none">
              <span className="font-display text-xl font-semibold tracking-widest text-gray-800">
                Nuvelle
              </span>
            </Link>

            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin/templates"
                className={`rounded-lg px-3 py-2 transition-colors ${
                  pathname.startsWith("/admin/templates")
                    ? "bg-primary-50 text-neutral-900"
                    : "text-neutral-500 hover:bg-primary-50 hover:text-neutral-900"
                }`}
              >
                템플릿 관리
              </Link>
              <Link
                href="/admin/invitations"
                className={`rounded-lg px-3 py-2 transition-colors ${
                  pathname.startsWith("/admin/invitations")
                    ? "bg-primary-50 text-neutral-900"
                    : "text-neutral-500 hover:bg-primary-50 hover:text-neutral-900"
                }`}
              >
                발행 청첩장
              </Link>
              <Link
                href="/admin/bgms"
                className={`rounded-lg px-3 py-2 transition-colors ${
                  pathname.startsWith("/admin/bgms")
                    ? "bg-primary-50 text-neutral-900"
                    : "text-neutral-500 hover:bg-primary-50 hover:text-neutral-900"
                }`}
              >
                BGM 관리
              </Link>
              <Link
                href="/admin/users"
                className={`rounded-lg px-3 py-2 transition-colors ${
                  pathname.startsWith("/admin/users")
                    ? "bg-primary-50 text-neutral-900"
                    : "text-neutral-500 hover:bg-primary-50 hover:text-neutral-900"
                }`}
              >
                회원 관리
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-neutral-400">관리자 계정</span>
              <span className="font-medium text-neutral-800">
                {user.name}님
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              title="로그아웃"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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
              <span className="text-sm">로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
