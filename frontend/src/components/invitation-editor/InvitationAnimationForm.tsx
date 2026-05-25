"use client";

import type { UpdateInvitationRequest } from "@/lib/api/invitations";

interface InvitationAnimationFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

const ANIMATION_OPTIONS = [
  { key: "", label: "없음" },
  { key: "fade", label: "페이드 인" },
  { key: "slide", label: "슬라이드 업" },
  { key: "zoom", label: "줌 인" },
];

export default function InvitationAnimationForm({
  data,
  onChange,
}: InvitationAnimationFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800">애니메이션 효과</h3>
        <p className="text-xs text-gray-400">
          공개 청첩장에 적용할 등장 효과를 선택하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ANIMATION_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange({ animationType: option.key })}
            className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
              (data.animationType ?? "") === option.key
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
