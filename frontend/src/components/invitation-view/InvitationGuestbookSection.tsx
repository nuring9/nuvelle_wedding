"use client";

import { useEffect, useState } from "react";
import GuestbookForm from "@/components/guestbook/GuestbookForm";
import GuestbookList from "@/components/guestbook/GuestbookList";
import { getGuestbookList, submitGuestbook } from "@/lib/api/public";
import type {
  GuestbookRequest,
  GuestbookResponse,
  PublicInvitation,
} from "@/types/invitation";

interface InvitationGuestbookSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationGuestbookSection({
  invitation,
}: InvitationGuestbookSectionProps) {
  const [guestbooks, setGuestbooks] = useState<GuestbookResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!invitation.guestbookEnabled) return;
    const fetchGuestbooks = async () => {
      try {
        const data = await getGuestbookList(invitation.slug);
        setGuestbooks(data);
      } catch {
        // 조용히 실패
      }
    };
    fetchGuestbooks();
  }, [invitation.slug, invitation.guestbookEnabled]);

  if (!invitation.guestbookEnabled) return null;

  const handleSubmit = async (data: GuestbookRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEntry = await submitGuestbook(invitation.slug, data);
      setGuestbooks((prev) => [newEntry, ...prev]);
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 section-tone-guestbook">
      {/* 작성 폼 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm font-medium text-gray-800">축하 메시지</span>
        </div>
        <span className={`text-gray-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* 작성 폼 (접기/펼치기) — 제출 완료 시 자동으로 접힘 */}
      {isOpen && (
        <div className="pb-4">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <GuestbookForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}

      {/* 방명록 목록 — 항상 표시 */}
      {guestbooks.length > 0 && (
        <div className="pb-5">
          <GuestbookList guestbooks={guestbooks} />
        </div>
      )}
    </section>
  );
}
