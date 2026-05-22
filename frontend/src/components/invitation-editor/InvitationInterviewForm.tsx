"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import { saveInterview, getInterview } from "@/lib/api/interview";
import type { WeddingInterviewRequest } from "@/types/interview";

interface InvitationInterviewFormProps {
  invitationId: number;
}

const DEFAULT_QUESTIONS = [
  "처음 만난 날을 기억하시나요?",
  "상대방의 어떤 점에 반하셨나요?",
  "프로포즈는 어떻게 하셨나요?",
  "결혼 후 가장 하고 싶은 것은?",
  "앞으로의 각오 한 마디",
];

export default function InvitationInterviewForm({
  invitationId,
}: InvitationInterviewFormProps) {
  const { accessToken } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<WeddingInterviewRequest>({
    question1: DEFAULT_QUESTIONS[0],
    answer1: "",
    question2: DEFAULT_QUESTIONS[1],
    answer2: "",
    question3: DEFAULT_QUESTIONS[2],
    answer3: "",
    question4: DEFAULT_QUESTIONS[3],
    answer4: "",
    question5: DEFAULT_QUESTIONS[4],
    answer5: "",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getInterview(invitationId);
        if (data) {
          setForm({
            question1: data.question1 ?? DEFAULT_QUESTIONS[0],
            answer1: data.answer1 ?? "",
            question2: data.question2 ?? DEFAULT_QUESTIONS[1],
            answer2: data.answer2 ?? "",
            question3: data.question3 ?? DEFAULT_QUESTIONS[2],
            answer3: data.answer3 ?? "",
            question4: data.question4 ?? DEFAULT_QUESTIONS[3],
            answer4: data.answer4 ?? "",
            question5: data.question5 ?? DEFAULT_QUESTIONS[4],
            answer5: data.answer5 ?? "",
          });
        }
      } catch {
        // 조용히 실패
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [invitationId]);

  const handleSave = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    setError(null);
    try {
      await saveInterview(invitationId, form, accessToken);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <svg
          className="animate-spin h-6 w-6 text-primary-400"
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
    );
  }

  const questions = [
    { qKey: "question1" as const, aKey: "answer1" as const },
    { qKey: "question2" as const, aKey: "answer2" as const },
    { qKey: "question3" as const, aKey: "answer3" as const },
    { qKey: "question4" as const, aKey: "answer4" as const },
    { qKey: "question5" as const, aKey: "answer5" as const },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800">웨딩 인터뷰</h3>
        <p className="text-xs text-gray-400">
          신랑신부에게 묻는 질문과 답변을 입력해주세요.
        </p>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {questions.map((q, index) => (
        <div
          key={q.qKey}
          className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl"
        >
          <p className="text-xs font-medium text-gray-500">Q{index + 1}</p>
          <InputField
            placeholder="질문을 입력하세요"
            value={form[q.qKey] ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [q.qKey]: e.target.value }))
            }
          />
          <TextareaField
            placeholder="답변을 입력하세요"
            value={form[q.aKey] ?? ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [q.aKey]: e.target.value }))
            }
            rows={3}
          />
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-40 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : saved ? "저장됨 ✓" : "인터뷰 저장하기"}
        </button>
      </div>
    </div>
  );
}
