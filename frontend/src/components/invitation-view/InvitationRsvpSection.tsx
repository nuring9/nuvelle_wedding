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
          <h2 className="text-base font-medium text-gray-800">참석 여부</h2>
          <p className="text-sm text-gray-400 mt-1">
            참석 가능 여부를 알려주세요
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

          <RsvpForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}
    </section>
  );
}
