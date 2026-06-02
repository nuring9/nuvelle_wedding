"use client";

import { RsvpRequest } from "@/types/invitation";
import { useState } from "react";
import InputField from "../common/InputField";
import PrimaryButton from "../common/PrimaryButton";

interface RsvpFormProps {
  onSubmit: (data: RsvpRequest) => Promise<void>;
  isLoading?: boolean;
  isDark?: boolean;
}

export default function RsvpForm({
  onSubmit,
  isLoading = false,
  isDark = false,
}: RsvpFormProps) {
  const labelCls = isDark ? "text-[11px] text-slate-300 tracking-wide" : "text-[11px] text-gray-400 tracking-wide";
  const inputCls = isDark ? "text-xs py-2 bg-slate-700 text-slate-100 border-slate-600" : "text-xs py-2";
  const labelFieldCls = isDark ? "text-xs font-normal text-slate-300" : "text-xs font-normal";
  const countCls = isDark ? "text-xs text-slate-200 w-5 text-center" : "text-xs text-gray-600 w-5 text-center";
  const btnBaseCls = isDark
    ? "w-7 h-7 rounded-full border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors flex items-center justify-center text-sm"
    : "w-7 h-7 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center text-sm";
  const optionUnselectedCls = isDark
    ? "bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-400 hover:text-slate-200"
    : "bg-white/60 text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-500";
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
        className={inputCls}
        labelClassName={labelFieldCls}
      />

      {/* 참석 여부 선택 */}
      <div className="flex flex-col gap-1.5">
        <label className={labelCls}>참석 여부</label>
        <div className="flex gap-1.5">
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
                  attendanceStatus: option.value as RsvpRequest["attendanceStatus"],
                }))
              }
              className={`flex-1 py-1.5 rounded-full text-xs border transition-colors ${
                form.attendanceStatus === option.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : optionUnselectedCls
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
          <label className={labelCls}>참석 인원</label>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, guestCount: Math.max(1, prev.guestCount - 1) }))} className={btnBaseCls}>−</button>
            <span className={countCls}>{form.guestCount}</span>
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, guestCount: prev.guestCount + 1 }))} className={btnBaseCls}>+</button>
          </div>
        </div>
      )}

      <InputField
        label="연락처 (선택)"
        placeholder="010-0000-0000"
        value={form.phone ?? ""}
        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        className={inputCls}
        labelClassName={labelFieldCls}
      />

      <InputField
        label="메시지 (선택)"
        placeholder="축하 메시지를 남겨주세요"
        value={form.message ?? ""}
        onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        className={inputCls}
        labelClassName={labelFieldCls}
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
