"use client";

import { useState } from "react";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import PrimaryButton from "@/components/common/PrimaryButton";
import type { HoneymoonPlanGenerateRequest } from "@/types/honeymoon";

interface HoneymoonGenerateFormProps {
  onSubmit: (data: HoneymoonPlanGenerateRequest) => Promise<void>;
  isLoading: boolean;
}

const TRAVEL_STYLE_OPTIONS = [
  { key: "휴양", label: "🏖️ 휴양" },
  { key: "액티비티", label: "🏄 액티비티" },
  { key: "미식", label: "🍽️ 미식" },
  { key: "문화", label: "🏛️ 문화" },
  { key: "쇼핑", label: "🛍️ 쇼핑" },
  { key: "자연", label: "🌿 자연" },
];

export default function HoneymoonGenerateForm({
  onSubmit,
  isLoading,
}: HoneymoonGenerateFormProps) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetType, setBudgetType] = useState<"1인" | "총액">("총액");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [companionStyle, setCompanionStyle] = useState("");
  const [mustInclude, setMustInclude] = useState("");
  const [mustExclude, setMustExclude] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleStyle = (key: string) => {
    setTravelStyles((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleSubmit = async () => {
    setError(null);

    if (!destination.trim()) {
      setError("여행지를 입력해주세요.");
      return;
    }
    if (!startDate) {
      setError("출발일을 입력해주세요.");
      return;
    }
    if (!endDate) {
      setError("도착일을 입력해주세요.");
      return;
    }
    if (endDate < startDate) {
      setError("도착일은 출발일 이후여야 합니다.");
      return;
    }
    if (!budgetAmount.trim()) {
      setError("예산을 입력해주세요.");
      return;
    }
    if (travelStyles.length === 0) {
      setError("여행 스타일을 하나 이상 선택해주세요.");
      return;
    }

    const budget = `${budgetAmount}만원 (${budgetType} 기준)`;

    await onSubmit({
      destination,
      startDate,
      endDate,
      budget,
      travelStyles,
      companionStyle: companionStyle || undefined,
      mustInclude: mustInclude || undefined,
      mustExclude: mustExclude || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 여행지 */}
      <div className="flex flex-col gap-2">
        <InputField
          label="여행지"
          placeholder="예: 발리, 몰디브, 파리, 제주도"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* 여행 기간 */}
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

      {/* 예산 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">예산</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center flex-1 input-base gap-1 px-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="예: 100"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm"
              min={0}
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">만원</span>
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm font-medium">
            {(["1인", "총액"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBudgetType(type)}
                className={`px-3 py-2 transition-colors ${
                  budgetType === type
                    ? "bg-primary-500 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {type} 기준
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 여행 스타일 */}
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

      {/* 동반자 특성 */}
      <TextareaField
        label="동반자 특성 (선택)"
        placeholder="예: 체력이 약한 편, 이동이 많으면 힘들어함, 아침형 인간"
        value={companionStyle}
        onChange={(e) => setCompanionStyle(e.target.value)}
        rows={2}
      />

      {/* 꼭 포함할 것 */}
      <TextareaField
        label="꼭 포함하고 싶은 것 (선택)"
        placeholder="예: 스노클링, 현지 시장 방문, 루프탑 바"
        value={mustInclude}
        onChange={(e) => setMustInclude(e.target.value)}
        rows={2}
      />

      {/* 제외할 것 */}
      <TextareaField
        label="제외하고 싶은 것 (선택)"
        placeholder="예: 번지점프, 긴 이동, 새벽 출발"
        value={mustExclude}
        onChange={(e) => setMustExclude(e.target.value)}
        rows={2}
      />

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 생성 버튼 */}
      <PrimaryButton
        type="button"
        onClick={handleSubmit}
        isLoading={isLoading}
        fullWidth
      >
        {isLoading ? "AI가 일정을 생성하고 있습니다..." : "AI 일정 생성하기"}
      </PrimaryButton>

      {isLoading && (
        <p className="text-xs text-gray-400 text-center">
          AI가 최적의 신혼여행 일정을 만들고 있습니다. 약 10~20초 정도
          소요됩니다.
        </p>
      )}
    </div>
  );
}
