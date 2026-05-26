"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/common/Header";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import PrimaryButton from "@/components/common/PrimaryButton";
import { getPlan, updatePlan } from "@/lib/api/honeymoon";
import type { HoneymoonPlanResponse } from "@/types/honeymoon";

const TRAVEL_STYLE_OPTIONS = [
  { key: "휴양", label: "🏖️ 휴양" },
  { key: "액티비티", label: "🏄 액티비티" },
  { key: "미식", label: "🍽️ 미식" },
  { key: "문화", label: "🏛️ 문화" },
  { key: "쇼핑", label: "🛍️ 쇼핑" },
  { key: "자연", label: "🌿 자연" },
];

export default function HoneymoonPlanEditPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params.planId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();

  const [plan, setPlan] = useState<HoneymoonPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [companionStyle, setCompanionStyle] = useState("");

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
        // 폼 초기값 설정
        setDestination(data.destination);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setBudget(data.budget);
        setTravelStyles(data.travelStyle ? data.travelStyle.split(", ") : []);
        setCompanionStyle(data.companionStyle ?? "");
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, planId, router]);

  const toggleStyle = (key: string) => {
    setTravelStyles((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleSubmit = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    setError(null);
    try {
      await updatePlan(
        planId,
        {
          destination,
          startDate,
          endDate,
          budget,
          travelStyles,
          companionStyle: companionStyle || undefined,
        },
        accessToken,
      );
      router.push(`/honeymoon/${planId}`);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setIsSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 max-w-lg mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/honeymoon/${planId}`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-serif text-gray-800">플랜 수정</h1>
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 폼 */}
        <div className="card-base p-6 flex flex-col gap-6">
          <InputField
            label="여행지"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">여행 기간</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">출발일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-base"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">도착일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-base"
                />
              </div>
            </div>
          </div>

          <InputField
            label="예산"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">여행 스타일</p>
            <div className="grid grid-cols-3 gap-2">
              {TRAVEL_STYLE_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggleStyle(option.key)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    travelStyles.includes(option.key)
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <TextareaField
            label="동반자 특성 (선택)"
            value={companionStyle}
            onChange={(e) => setCompanionStyle(e.target.value)}
            rows={2}
          />

          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            isLoading={isSaving}
            fullWidth
          >
            수정 완료
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
