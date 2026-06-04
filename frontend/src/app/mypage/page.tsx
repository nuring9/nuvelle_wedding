"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getMyInvitations, type InvitationSummaryResponse } from "@/lib/api/invitations";
import { getMyPlans } from "@/lib/api/honeymoon";
import { withdrawMe } from "@/lib/api/users";
import { useAuthStore } from "@/stores/authStore";
import type { HoneymoonPlanSummaryResponse } from "@/types/honeymoon";

const invitationStatusLabel = {
  DRAFT: "임시저장",
  PRIVATE: "비공개",
  PUBLISHED: "발행됨",
};

const invitationStatusClass = {
  DRAFT: "bg-neutral-100 text-neutral-600",
  PRIVATE: "bg-amber-50 text-amber-700",
  PUBLISHED: "bg-green-50 text-green-700",
};

function formatDate(value: string | null) {
  if (!value) return "미정";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export default function MyPage() {
  const router = useRouter();
  const {
    accessToken,
    clearAuth,
    hasHydrated,
    isAuthenticated,
    user,
  } = useAuthStore();
  const [invitations, setInvitations] = useState<InvitationSummaryResponse[]>([]);
  const [plans, setPlans] = useState<HoneymoonPlanSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const savedPlans = useMemo(
    () => plans.filter((plan) => plan.status === "SAVED"),
    [plans],
  );
  const publishedInvitations = useMemo(
    () => invitations.filter((invitation) => invitation.status === "PUBLISHED"),
    [invitations],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!accessToken) return;

    let isMounted = true;

    const loadMyPage = async () => {
      try {
        const [invitationData, planData] = await Promise.all([
          getMyInvitations(accessToken),
          getMyPlans(accessToken),
        ]);

        if (!isMounted) return;
        setInvitations(invitationData);
        setPlans(planData);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadMyPage();

    return () => {
      isMounted = false;
    };
  }, [accessToken, hasHydrated, isAuthenticated, router]);

  const handleWithdraw = async () => {
    if (!accessToken) return;

    setIsWithdrawing(true);
    setWithdrawError(null);

    try {
      await withdrawMe(confirmText, accessToken);
      clearAuth();
      router.replace("/");
    } catch (err) {
      setWithdrawError(
        err instanceof Error ? err.message : "회원탈퇴 처리에 실패했습니다.",
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* 프로파일 히어로 */}
      <div className="bg-white border-b border-neutral-100 pt-14">
        <div className="mx-auto max-w-screen-lg px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-0.5">
                  My Page
                </p>
                <h1 className="text-2xl font-serif font-semibold text-neutral-900">
                  {user?.name}님
                </h1>
                <p className="text-sm text-neutral-400 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-neutral-900">{publishedInvitations.length}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">청첩장</p>
                </div>
                <div className="w-px bg-neutral-100" />
                <div>
                  <p className="text-lg font-semibold text-neutral-900">{savedPlans.length}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">여행 일정</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(true)}
                className="ml-4 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-400 hover:border-red-200 hover:text-red-500 transition-colors"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-screen-lg px-4 pb-20 pt-10">
        {isLoading && (
          <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-400">
            마이페이지 정보를 불러오는 중입니다.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-12">
            {/* 청첩장 섹션 */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">내 청첩장</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">발행된 청첩장만 표시됩니다</p>
                </div>
                <Link
                  href="/invitations"
                  className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  전체 보기 →
                </Link>
              </div>

              {publishedInvitations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center">
                  <p className="text-sm text-neutral-400">아직 발행된 청첩장이 없습니다</p>
                  <Link
                    href="/invitations"
                    className="mt-3 inline-block text-xs font-medium text-primary-600 hover:text-primary-800"
                  >
                    청첩장 만들기 →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {publishedInvitations.slice(0, 3).map((invitation) => (
                    <Link
                      key={invitation.id}
                      href={`/invite/${invitation.slug}`}
                      className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${invitationStatusClass[invitation.status]}`}
                        >
                          {invitationStatusLabel[invitation.status]}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {formatDate(invitation.updatedAt)}
                        </span>
                      </div>
                      <h3 className="line-clamp-1 font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {invitation.title || invitation.templateName}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        {invitation.groomName || "신랑"} · {invitation.brideName || "신부"}
                      </p>
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400">
                          예식일 <span className="text-neutral-600 font-medium">{formatDate(invitation.weddingDate)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* 여행 일정 섹션 */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">확정된 여행 일정</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">저장 완료된 신혼여행 플랜</p>
                </div>
                <Link
                  href="/honeymoon"
                  className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  전체 보기 →
                </Link>
              </div>

              {savedPlans.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center">
                  <p className="text-sm text-neutral-400">아직 확정된 여행 일정이 없습니다</p>
                  <Link
                    href="/honeymoon"
                    className="mt-3 inline-block text-xs font-medium text-primary-600 hover:text-primary-800"
                  >
                    신혼여행 플랜 만들기 →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {savedPlans.slice(0, 3).map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/honeymoon/${plan.id}`}
                      className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          확정
                        </span>
                        <span className="text-[11px] text-neutral-400">{plan.totalDays}일</span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {plan.destination}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                      </p>
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400 line-clamp-1">{plan.travelStyle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />

      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">회원탈퇴</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              탈퇴하면 현재 계정으로 로그인할 수 없습니다. 청첩장과 여행 일정은
              삭제하지 않고 탈퇴 회원의 이력으로 보관됩니다.
            </p>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium text-neutral-700">
                탈퇴 확인 문구
              </span>
              <input
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-300"
                placeholder="탈퇴합니다"
              />
            </label>

            {withdrawError && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {withdrawError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setConfirmText("");
                  setWithdrawError(null);
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={confirmText !== "탈퇴합니다" || isWithdrawing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isWithdrawing ? "처리 중..." : "탈퇴 처리"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
