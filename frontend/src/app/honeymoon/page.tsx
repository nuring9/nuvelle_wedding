"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useDialog } from "@/components/common/DialogProvider";
import HoneymoonPlanCard from "@/components/honeymoon/HoneymoonPlanCard";
import { getMyPlans, deletePlan } from "@/lib/api/honeymoon";
import type { HoneymoonPlanSummaryResponse } from "@/types/honeymoon";

export default function HoneymoonPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();
  const { alert, confirm } = useDialog();
  const [plans, setPlans] = useState<HoneymoonPlanSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!accessToken) return;

    const fetch = async () => {
      try {
        const data = await getMyPlans(accessToken);
        setPlans(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, router]);

  const handleDelete = async (planId: number) => {
    if (!accessToken) return;
    if (!(await confirm("플랜을 삭제하시겠습니까?"))) return;
    try {
      await deletePlan(planId, accessToken);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch {
      await alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="pt-24 w-full max-w-screen-lg mx-auto px-4 py-8 grow">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between mt-8 mb-8">
          <div>
            <h1 className="text-xl font-serif text-gray-800">
              신혼여행 플래너
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              AI가 최적의 신혼여행 일정을 만들어드립니다
            </p>
          </div>
          <Link href="/honeymoon/new" className="btn-primary text-sm px-4 py-2">
            새 플랜 만들기
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
        {!isLoading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">✈️</span>
            <p className="text-gray-500 text-sm mb-6">
              아직 만든 신혼여행 플랜이 없습니다.
            </p>
            <Link href="/honeymoon/new" className="btn-primary">
              첫 플랜 만들기
            </Link>
          </div>
        )}

        {/* 플랜 목록 */}
        {!isLoading && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <HoneymoonPlanCard
                key={plan.id}
                plan={plan}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
