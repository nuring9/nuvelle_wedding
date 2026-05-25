"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import { saveInterview, getInterviewForEditor } from "@/lib/api/interview";
import type { WeddingInterviewRequest } from "@/types/interview";

interface InvitationInterviewFormProps {
  invitationId: number;
}

interface InterviewFormItem {
  question: string;
  answer: string;
}

const MAX_INTERVIEW_COUNT = 10;

const DEFAULT_QUESTIONS = [
  "처음 만난 날을 기억하시나요?",
  "상대방의 어떤 점에 반하셨나요?",
  "프로포즈는 어떻게 하셨나요?",
];

function createEmptyItem(index: number): InterviewFormItem {
  return {
    question: DEFAULT_QUESTIONS[index] ?? "",
    answer: "",
  };
}

function requestToItems(data: WeddingInterviewRequest | null) {
  if (!data) {
    return DEFAULT_QUESTIONS.map((question) => ({ question, answer: "" }));
  }

  const items = Array.from({ length: MAX_INTERVIEW_COUNT }, (_, index) => {
    const number = index + 1;
    const questionKey = `question${number}` as keyof WeddingInterviewRequest;
    const answerKey = `answer${number}` as keyof WeddingInterviewRequest;

    return {
      question: String(data[questionKey] ?? ""),
      answer: String(data[answerKey] ?? ""),
    };
  });

  const savedItems = items.filter(
    (item) => item.question.trim() || item.answer.trim(),
  );

  return savedItems.length > 0
    ? savedItems
    : DEFAULT_QUESTIONS.map((question) => ({ question, answer: "" }));
}

function itemsToRequest(items: InterviewFormItem[]): WeddingInterviewRequest {
  return Array.from({ length: MAX_INTERVIEW_COUNT }).reduce(
    (payload, _, index) => {
      const number = index + 1;
      const item = items[index];

      return {
        ...payload,
        [`question${number}`]: item?.question ?? "",
        [`answer${number}`]: item?.answer ?? "",
      };
    },
    {} as WeddingInterviewRequest,
  );
}

export default function InvitationInterviewForm({
  invitationId,
}: InvitationInterviewFormProps) {
  const { accessToken } = useAuthStore();
  const [items, setItems] = useState<InterviewFormItem[]>(
    DEFAULT_QUESTIONS.map((question) => ({ question, answer: "" })),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getInterviewForEditor(invitationId, accessToken);
        setItems(requestToItems(data));
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [accessToken, invitationId]);

  const updateItem = (
    index: number,
    key: keyof InterviewFormItem,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prev) => {
      if (prev.length >= MAX_INTERVIEW_COUNT) return prev;
      return [...prev, createEmptyItem(prev.length)];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const handleSave = async () => {
    if (!accessToken) {
      setError("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveInterview(invitationId, itemsToRequest(items), accessToken);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-800">웨딩 인터뷰</h3>
          <p className="text-xs text-gray-400">
            질문과 답변은 최대 10개까지 추가할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          disabled={items.length >= MAX_INTERVIEW_COUNT}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-lg font-semibold leading-none text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="인터뷰 질문 추가"
        >
          +
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-gray-500">Q{index + 1}</p>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={items.length <= 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-lg font-semibold leading-none text-gray-400 transition-colors hover:border-primary-200 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="인터뷰 질문 삭제"
            >
              -
            </button>
          </div>

          <InputField
            placeholder="질문을 입력하세요"
            value={item.question}
            onChange={(e) => updateItem(index, "question", e.target.value)}
          />
          <TextareaField
            placeholder="답변을 입력하세요"
            value={item.answer}
            onChange={(e) => updateItem(index, "answer", e.target.value)}
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
