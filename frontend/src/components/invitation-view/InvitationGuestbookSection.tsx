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
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border-y border-gray-100 py-5 text-left"
      >
        <div>
          <h2 className="text-base font-medium text-gray-800">축하 메시지</h2>
          <p className="text-sm text-gray-400 mt-1">
            신랑 신부에게 마음을 남겨주세요
          </p>
        </div>

        <span
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="pt-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <GuestbookForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <GuestbookList guestbooks={guestbooks} />
        </div>
      )}
    </section>
  );
}
