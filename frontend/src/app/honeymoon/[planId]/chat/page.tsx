"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import HoneymoonChatBubble from "@/components/honeymoon/HoneymoonChatBubble";
import {
  createPlanFromChatSuggestion,
  getPlan,
  getChatHistory,
  sendChatMessage,
} from "@/lib/api/honeymoon";
import type {
  HoneymoonPlanResponse,
  HoneymoonChatMessage,
} from "@/types/honeymoon";

const QUICK_QUESTIONS = [
  "2일차 일정을 더 여유롭게 바꿔줘",
  "현지에서 꼭 먹어야 할 음식 추천해줘",
  "신혼여행 짐 싸는 체크리스트 만들어줘",
  "예산을 아낄 수 있는 팁 알려줘",
];

export default function HoneymoonChatPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params.planId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();

  const [plan, setPlan] = useState<HoneymoonPlanResponse | null>(null);
  const [messages, setMessages] = useState<HoneymoonChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [creatingPlanMessageId, setCreatingPlanMessageId] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 임시 메시지 id를 만들기 위한 값이다.
  // 서버에서 내려오는 id는 보통 양수이므로, 프론트 임시 id는 음수로 만들어 충돌을 피한다. 이건 프론트에서사용하는 임시 id라서
  const tempIdRef = useRef(-1);

  // 스크롤 하단 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!accessToken) return;

    const fetch = async () => {
      try {
        const [planData, historyData] = await Promise.all([
          getPlan(planId, accessToken),
          getChatHistory(planId, accessToken),
        ]);
        setPlan(planData);
        setMessages(historyData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, planId, router]);

  const handleSend = async (messageText?: string) => {
    const text = messageText ?? input.trim();
    if (!text || !accessToken || isSending) return;

    setInput("");
    setIsSending(true);
    setError(null);

    // 사용자 메시지 낙관적 업데이트
    const tempUserMessage: HoneymoonChatMessage = {
      id: tempIdRef.current--,
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const aiMessage = await sendChatMessage(
        planId,
        { message: text },
        accessToken,
      );
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      // 실패 시 낙관적 업데이트 롤백
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreatePlanFromSuggestion = async (messageId: number) => {
    if (!accessToken || creatingPlanMessageId) return;

    setCreatingPlanMessageId(messageId);
    setError(null);

    try {
      const newPlan = await createPlanFromChatSuggestion(
        planId,
        messageId,
        accessToken,
      );
      router.push(`/honeymoon/${newPlan.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("새 일정 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCreatingPlanMessageId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
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
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Link
          href={`/honeymoon/${planId}`}
          className="text-gray-500 hover:text-gray-700 transition-colors"
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
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-gray-800">
            AI 플래너와 대화하기
          </h1>
          {plan && (
            <p className="text-xs text-gray-400">
              {plan.destination} · {plan.startDate} ~ {plan.endDate}
            </p>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-sm">✈️</span>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-screen-lg mx-auto">
        {/* 빈 상태 */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="text-4xl mb-4">✈️</div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              AI 플래너에게 무엇이든 물어보세요
            </p>
            <p className="text-xs text-gray-400 mb-8">
              현재 신혼여행 일정을 기반으로 답변해드립니다.
            </p>

            {/* 빠른 질문 */}
            <div className="w-full max-w-sm flex flex-col gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-left text-sm px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.map((message) => (
          <HoneymoonChatBubble
            key={message.id}
            message={message}
            onCreatePlan={handleCreatePlanFromSuggestion}
            isCreatingPlan={creatingPlanMessageId === message.id}
          />
        ))}

        {/* AI 응답 로딩 */}
        {isSending && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
              <span className="text-xs">✈️</span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="flex justify-center mb-4">
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-full">
              {error}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gray-50 px-4 pt-3 pb-6 sm:pb-8 flex-shrink-0">
        <div className="max-w-screen-lg mx-auto bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
          {/* 빠른 질문 (메시지 있을 때) */}
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  disabled={isSending}
                  className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요... (Enter로 전송)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary-400 transition-colors"
              style={{ maxHeight: "120px" }}
              disabled={isSending}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
