"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/common/Header";
import HoneymoonPlanDayCard from "@/components/honeymoon/HoneymoonPlanDayCard";
import HoneymoonDayEditModal from "@/components/honeymoon/HoneymoonDayEditModal";
import { getPlan, savePlan, updatePlanDay } from "@/lib/api/honeymoon";
import type {
  HoneymoonPlanResponse,
  HoneymoonPlanDayResponse,
  HoneymoonPlanDayUpdateRequest,
} from "@/types/honeymoon";

export default function HoneymoonPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params.planId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();

  const [plan, setPlan] = useState<HoneymoonPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDaySaving, setIsDaySaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<HoneymoonPlanDayResponse | null>(
    null,
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!accessToken) return;

    const fetch = async () => {
      try {
        const data = await getPlan(planId, accessToken);
        setPlan(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, planId, router]);

  // 플랜 저장 (DRAFT → SAVED)
  const handleSave = async () => {
    if (!accessToken || !plan) return;
    setIsSaving(true);
    try {
      const updated = await savePlan(planId, accessToken);
      setPlan(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Day 일정 수정
  const handleDaySave = async (
    dayId: number,
    data: HoneymoonPlanDayUpdateRequest,
  ) => {
    if (!accessToken || !plan) return;
    setIsDaySaving(true);
    try {
      const updatedDay = await updatePlanDay(planId, dayId, data, accessToken);
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          days: prev.days.map((d) => (d.id === dayId ? updatedDay : d)),
        };
      });
      setEditingDay(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsDaySaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center pt-32">
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
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
          <p className="text-gray-500 text-sm">
            {error || "플랜을 불러오지 못했습니다."}
          </p>
          <Link href="/honeymoon" className="btn-primary">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 max-w-screen-lg mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-start justify-between mt-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/honeymoon"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                신혼여행 플래너
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-600">{plan.destination}</span>
            </div>
            <h1 className="text-xl font-serif text-gray-800">
              {plan.destination}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {plan.startDate} ~ {plan.endDate} · {plan.days.length}일 ·{" "}
              {plan.budget}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                plan.status === "SAVED"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {plan.status === "SAVED" ? "저장됨" : "임시저장"}
            </span>
            {plan.status === "DRAFT" && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary text-sm px-4 py-2"
              >
                {isSaving ? "저장 중..." : "저장하기"}
              </button>
            )}
          </div>
        </div>

        {/* 요약 정보 */}
        {plan.travelStyle && (
          <div className="card-base p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {plan.travelStyle.split(", ").map((style) => (
                <span
                  key={style}
                  className="text-xs px-3 py-1 bg-primary-50 text-primary-600 rounded-full"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Day별 일정 */}
        {plan.days.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">
              일정 ({plan.days.length}일)
            </h2>
            {plan.days.map((day) => (
              <HoneymoonPlanDayCard
                key={day.id}
                day={day}
                onEdit={setEditingDay}
              />
            ))}
          </div>
        ) : (
          // Day 파싱 실패 시 AI 원본 텍스트 표시
          <div className="card-base p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              AI 생성 일정
            </h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {plan.aiGeneratedContent}
            </p>
          </div>
        )}

        {/* 2차 구현: 챗봇 링크 */}
        <div className="mt-8 p-5 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl text-center">
          <p className="text-sm font-medium text-gray-700 mb-1">
            일정을 수정하고 싶으신가요?
          </p>
          <p className="text-xs text-gray-500 mb-4">
            AI 챗봇으로 일정을 보완하는 기능은 곧 추가될 예정입니다.
          </p>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </main>

      {/* Day 수정 모달 */}
      {editingDay && (
        <HoneymoonDayEditModal
          day={editingDay}
          onSave={handleDaySave}
          onClose={() => setEditingDay(null)}
          isSaving={isDaySaving}
        />
      )}
    </div>
  );
}
