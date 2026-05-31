"use client";

import { useEffect, useRef, useState } from "react";

interface TimePickerProps {
  label?: string;
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  required?: boolean;
}

export default function TimePicker({
  label,
  value,
  onChange,
  required,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [hour, setHour] = useState(() => {
    const h = value ? parseInt(value.split(":")[0]) : 12;
    return Number.isFinite(h) ? h : 12;
  });
  const [minute, setMinute] = useState(() => {
    const m = value ? parseInt(value.split(":")[1]) : 0;
    return Number.isFinite(m) ? m : 0;
  });

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (Number.isFinite(h)) setHour(h);
      if (Number.isFinite(m)) setMinute(m);
    }
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleApply = (h: number, m: number) => {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    onChange(`${hh}:${mm}`);
  };

  const displayValue = value
    ? (() => {
        const h = parseInt(value.split(":")[0]);
        const m = parseInt(value.split(":")[1]);
        const ampm = h < 12 ? "오전" : "오후";
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${ampm} ${displayH}시 ${String(m).padStart(2, "0")}분`;
      })()
    : "";

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div ref={ref} className="relative flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="input-base text-left flex items-center justify-between"
      >
        <span className={displayValue ? "text-gray-800" : "text-gray-400"}>
          {displayValue || "시간을 선택해주세요"}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64">
          <p className="text-xs font-semibold text-gray-500 mb-3 text-center">시간 선택</p>

          <div className="flex gap-3">
            {/* 시 */}
            <div className="flex-1">
              <p className="text-xs text-gray-400 text-center mb-1.5">시</p>
              <div className="h-40 overflow-y-auto scrollbar-hide rounded-xl border border-gray-100">
                {hours.map((h) => {
                  const ampm = h < 12 ? "오전" : "오후";
                  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        setHour(h);
                        handleApply(h, minute);
                      }}
                      className={`w-full py-1.5 text-xs transition-colors ${
                        hour === h
                          ? "bg-primary-500 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {ampm} {displayH}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 분 */}
            <div className="flex-1">
              <p className="text-xs text-gray-400 text-center mb-1.5">분</p>
              <div className="h-40 overflow-y-auto scrollbar-hide rounded-xl border border-gray-100">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMinute(m);
                      handleApply(hour, m);
                    }}
                    className={`w-full py-1.5 text-xs transition-colors ${
                      minute === m
                        ? "bg-primary-500 text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {String(m).padStart(2, "0")}분
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full py-2 rounded-xl bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors"
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
}
