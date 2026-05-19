"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/common/Header";
import {
  getMyInvitations,
  deleteInvitation,
  type InvitationSummaryResponse,
} from "@/lib/api/invitations";

export default function InvitationsPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();
  const [invitations, setInvitations] = useState<InvitationSummaryResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!accessToken) return;

    const fetchInvitations = async () => {
      try {
        const data = await getMyInvitations(accessToken);
        setInvitations(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvitations();
  }, [hasHydrated, isAuthenticated, accessToken, router]);

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("청첩장을 삭제하시겠습니까?")) return;
    try {
      await deleteInvitation(id, accessToken);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const statusLabel = {
    DRAFT: "임시저장",
    PRIVATE: "비공개",
    PUBLISHED: "발행됨",
  };

  const statusColor = {
    DRAFT: "bg-gray-100 text-gray-500",
    PRIVATE: "bg-yellow-50 text-yellow-600",
    PUBLISHED: "bg-green-50 text-green-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 max-w-screen-lg mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-serif text-gray-800">내 청첩장</h1>
          <Link href="/templates" className="btn-primary text-sm px-4 py-2">
            새로 만들기
          </Link>
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex justify-center py-24">
            <svg
              className="animate-spin h-8 w-8 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* 빈 목록 */}
        {!isLoading && !error && invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">💌</span>
            <p className="text-gray-500 text-sm mb-6">
              아직 만든 청첩장이 없습니다.
            </p>
            <Link href="/templates" className="btn-primary">
              첫 청첩장 만들기
            </Link>
          </div>
        )}

        {/* 청첩장 목록 */}
        {!isLoading && !error && invitations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="card-base overflow-hidden">
                {/* 썸네일 */}
                <div className="relative aspect-[3/2] bg-gray-100">
                  {invitation.mainImageUrl ? (
                    <Image
                      src={invitation.mainImageUrl}
                      alt="청첩장 메인 사진"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-champagne to-blush">
                      <span className="text-3xl">💍</span>
                    </div>
                  )}
                  {/* 상태 뱃지 */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        statusColor[invitation.status]
                      }`}
                    >
                      {statusLabel[invitation.status]}
                    </span>
                  </div>
                </div>

                {/* 청첩장 정보 */}
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">
                    {invitation.templateName}
                  </p>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    {invitation.groomName && invitation.brideName
                      ? `${invitation.groomName} ♥ ${invitation.brideName}`
                      : invitation.title || "제목 없음"}
                  </h3>
                  {invitation.weddingDate && (
                    <p className="text-xs text-gray-400 mb-3">
                      {invitation.weddingDate}
                    </p>
                  )}

                  {/* 버튼 */}
                  <div className="flex gap-2">
                    <Link
                      href={`/invitations/${invitation.id}/edit`}
                      className="btn-primary flex-1 text-center text-xs py-2"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(invitation.id)}
                      className="btn-ghost text-xs px-3 py-2 text-red-400 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
