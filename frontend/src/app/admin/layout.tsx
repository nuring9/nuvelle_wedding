"use client";

import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/userAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasHydrated, isAuthenticated } = useAuthStore();
  const { handleLogout, isLoading } = useAuth();
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/templates" className="font-semibold text-gray-800">
            Nuvelle 관리자
          </Link>

          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/admin/templates" className="hover:text-gray-900">
              템플릿 관리
            </Link>
            <Link href="/admin/invitations" className="hover:text-gray-900">
              발행 청첩장
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
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
      <div className="p-6">{children}</div>
    </div>
  );
}
