"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/common/Header";
import HoneymoonGenerateForm from "@/components/honeymoon/HoneymoonGenerateForm";
import { generatePlan } from "@/lib/api/honeymoon";
import type { HoneymoonPlanGenerateRequest } from "@/types/honeymoon";

export default function HoneymoonNewPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleSubmit = async (data: HoneymoonPlanGenerateRequest) => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generatePlan(data, accessToken);
      router.push(`/honeymoon/${plan.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("일정 생성에 실패했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 max-w-lg mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-xl font-serif text-gray-800 mb-2">
            새 신혼여행 플랜
          </h1>
          <p className="text-sm text-gray-400">
            조건을 입력하면 AI가 최적의 일정을 만들어드립니다.
          </p>
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 폼 */}
        <div className="card-base p-6">
          <HoneymoonGenerateForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
