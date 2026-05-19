"use client";

import type { PublicInvitation } from "@/types/invitation";
import CopyButton from "@/components/common/CopyButton";

interface InvitationAccountSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationAccountSection({
  invitation,
}: InvitationAccountSectionProps) {
  if (
    !invitation.accountEnabled ||
    !invitation.accountBank ||
    !invitation.accountNumber
  ) {
    return null;
  }

  const accountText = `${invitation.accountBank} ${invitation.accountNumber} ${invitation.accountHolder || ""}`;

  return (
    <section className="section-padding">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Account
      </h2>

      <div className="card-base p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400">{invitation.accountBank}</p>
            <p className="text-sm font-medium text-gray-800">
              {invitation.accountNumber}
            </p>
            {invitation.accountHolder && (
              <p className="text-xs text-gray-500">
                예금주: {invitation.accountHolder}
              </p>
            )}
          </div>
          <CopyButton text={accountText} label="복사" />
        </div>
      </div>
    </section>
  );
}
