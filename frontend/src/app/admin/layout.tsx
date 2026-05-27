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
              className="rounded-lg border border-primary-100 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-primary-50 hover:text-neutral-900 disabled:opacity-50"
            >
              로그아웃
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
