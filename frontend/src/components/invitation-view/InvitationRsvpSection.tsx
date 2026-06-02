"use client";

import { useState } from "react";
import RsvpForm from "@/components/rsvp/RsvpForm";
import { submitRsvp } from "@/lib/api/public";
import type { PublicInvitation, RsvpRequest } from "@/types/invitation";

interface InvitationRsvpSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationRsvpSection({
  invitation,
}: InvitationRsvpSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!invitation.rsvpEnabled) return null;

  const handleSubmit = async (data: RsvpRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await submitRsvp(invitation.slug, data);
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-8 section-tone-rsvp">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-sm font-medium text-gray-800">참석 여부</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="pb-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <RsvpForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}
    </section>
  );
}
