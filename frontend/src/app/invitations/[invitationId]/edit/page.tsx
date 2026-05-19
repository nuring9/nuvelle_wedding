"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import InvitationEditorLayout from "@/components/invitation-editor/InvitationEditorLayout";
import { getInvitation, type InvitationResponse } from "@/lib/api/invitations";

export default function InvitationEditPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = Number(params.invitationId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();

  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (isNaN(invitationId)) {
      router.replace("/invitations");
      return;
    }

    if (!accessToken) return;

    const fetch = async () => {
      try {
        const data = await getInvitation(invitationId, accessToken);
        setInvitation(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("청첩장을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, invitationId, router]);

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
          {error || "청첩장을 찾을 수 없습니다."}
        </p>
        <button
          onClick={() => router.push("/invitations")}
          className="btn-secondary"
        >
          내 청첩장으로
        </button>
      </div>
    );
  }

  return <InvitationEditorLayout invitation={invitation} />;
}
