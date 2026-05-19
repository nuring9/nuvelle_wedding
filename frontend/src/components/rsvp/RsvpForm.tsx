"use client";

import { RsvpRequest } from "@/types/invitation";
import { useState } from "react";
import InputField from "../common/InputField";
import PrimaryButton from "../common/PrimaryButton";

interface RsvpFormProps {
  onSubmit: (data: RsvpRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function RsvpForm({
  onSubmit,
  isLoading = false,
}: RsvpFormProps) {
  const [form, setForm] = useState<RsvpRequest>({
    guestName: "",
    attendanceStatus: "ATTENDING",
    guestCount: 1,
    message: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onSubmit(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <span className="text-3xl mb-3 block">✉️</span>
        <p className="text-sm text-gray-600">참석 여부가 전달되었습니다.</p>
        <p className="text-xs text-gray-400 mt-1">감사합니다.</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="이름"
        placeholder="성함을 입력하세요"
        value={form.guestName}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, guestName: e.target.value }))
        }
        required
      />

      {/* 참석 여부 선택 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">참석 여부</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "ATTENDING", label: "참석" },
            { value: "NOT_ATTENDING", label: "불참" },
            { value: "UNDECIDED", label: "미정" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  attendanceStatus:
                    option.value as RsvpRequest["attendanceStatus"],
                }))
              }
              className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.attendanceStatus === option.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 참석 상태일 때만 인원 선택 영역 보여줌 */}
      {form.attendanceStatus === "ATTENDING" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">참석 인원</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  // 참석 인원은 최소 1명 아래로 내려가지 않도록 제한.
                  guestCount: Math.max(1, prev.guestCount - 1),
                }))
              }
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <span className="text-sm font-medium text-gray-800 w-6 text-center">
              {form.guestCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  guestCount: prev.guestCount + 1,
                }))
              }
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      )}

      <InputField
        label="연락처 (선택)"
        placeholder="010-0000-0000"
        value={form.phone ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, phone: e.target.value }))
        }
      />

      <InputField
        label="메시지 (선택)"
        placeholder="축하 메시지를 남겨주세요"
        value={form.message ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, message: e.target.value }))
        }
      />

      <PrimaryButton
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="mt-2"
      >
        참석 여부 전달하기
      </PrimaryButton>
    </form>
  );
}
