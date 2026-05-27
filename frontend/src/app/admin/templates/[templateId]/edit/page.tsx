"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getOrCreateMasterInvitation } from "@/lib/api/admin";
import InvitationEditorLayout from "@/components/invitation-editor/InvitationEditorLayout";
import type { InvitationResponse } from "@/lib/api/invitations";

export default function AdminTemplateEditPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = Number(params.templateId);
  const { accessToken, hasHydrated, isAuthenticated } = useAuthStore();

  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!accessToken) {
      return;
    }

    if (isNaN(templateId)) {
      router.replace("/admin/templates");
      return;
    }

    const fetch = async () => {
      try {
        const data = await getOrCreateMasterInvitation(templateId, accessToken);
        setInvitation(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("마스터 청첩장을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, templateId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">
          {error || "마스터 청첩장을 찾을 수 없습니다."}
        </p>
        <button
          onClick={() => router.push("/admin/templates")}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg"
        >
          템플릿 목록으로
        </button>
      </div>
    );
  }

  return <InvitationEditorLayout invitation={invitation} />;
}
