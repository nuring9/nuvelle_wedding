"use client";

import { useState } from "react";
import TextareaField from "@/components/common/TextareaField";
import InputField from "@/components/common/InputField";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import type {
  HoneymoonPlanDayResponse,
  HoneymoonPlanDayUpdateRequest,
} from "@/types/honeymoon";

interface HoneymoonDayEditModalProps {
  day: HoneymoonPlanDayResponse;
  onSave: (dayId: number, data: HoneymoonPlanDayUpdateRequest) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

export default function HoneymoonDayEditModal({
  day,
  onSave,
  onClose,
  isSaving,
}: HoneymoonDayEditModalProps) {
  const [title, setTitle] = useState(day.title);
  const [description, setDescription] = useState(day.description);
  const [activities, setActivities] = useState(day.activities.join("\n"));
  const [meals, setMeals] = useState(day.meals.join("\n"));
  const [tips, setTips] = useState(day.tips);

  const handleSave = async () => {
    await onSave(day.id, {
      title,
      description,
      activities: activities
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean),
      meals: meals
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean),
      tips,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            Day {day.dayNumber} 일정 수정
          </h3>
          <button
            type="button"
            onClick={onClose}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <div className="p-5 flex flex-col gap-5">
          <InputField
            label="일정 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextareaField
            label="일정 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <TextareaField
            label="활동 목록"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            rows={3}
            hint="한 줄에 하나씩 입력해주세요."
          />

          <TextareaField
            label="식사 추천"
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
            rows={3}
            hint="한 줄에 하나씩 입력해주세요."
          />

          <TextareaField
            label="팁"
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            rows={2}
          />

          <div className="flex gap-3 pt-2">
            <SecondaryButton type="button" onClick={onClose} fullWidth>
              취소
            </SecondaryButton>
            <PrimaryButton
              type="button"
              onClick={handleSave}
              isLoading={isSaving}
              fullWidth
            >
              저장하기
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
