"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { createInvitation } from "@/lib/api/invitations";

export default function TemplateUsePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = Number(params.templateId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    // 비로그인 시 로그인 페이지로
    if (!isAuthenticated) {
      router.replace(`/login?redirect=/templates/${templateId}/use`);
      return;
    }

    if (!accessToken) return;

    const create = async () => {
      try {
        const invitation = await createInvitation({ templateId }, accessToken);
        router.replace(`/invitations/${invitation.id}/edit`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("청첩장 생성에 실패했습니다.");
        }
      }
    };

    create();
  }, [hasHydrated, isAuthenticated, accessToken, templateId, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => router.back()} className="btn-secondary">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
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
        <p className="text-sm text-gray-500">청첩장을 준비하고 있습니다...</p>
      </div>
    </div>
  );
}
