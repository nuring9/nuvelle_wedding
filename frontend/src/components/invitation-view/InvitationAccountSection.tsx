"use client";

import type { PublicInvitation } from "@/types/invitation";
import CopyButton from "@/components/common/CopyButton";

interface InvitationAccountSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationAccountSection({
  invitation,
}: InvitationAccountSectionProps) {
  const accounts = (invitation.accounts ?? []).filter(
    (account) => account.bankName && account.accountNumber,
  );

  if (!invitation.accountEnabled || accounts.length === 0) return null;

  return (
    <section className="section-padding section-tone-account">
      <div className="mb-8 text-center">
        <p className="text-xs tracking-widest text-gray-400">마음 전하실 곳</p>
        <p className="mt-3 text-sm leading-7 text-gray-500">
          축하의 마음을 전하고 싶으신 분들을 위해
          <br /> 계좌 정보를 안내드립니다.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {accounts.map((account, index) => {
          const accountText = `${account.bankName} ${account.accountNumber} ${
            account.accountHolder || ""
          }`;
          const remittanceLink =
            account.remittanceLink || invitation.remittanceLink;

          return (
            <div
              key={`${account.side}-${account.label}-${index}`}
              className="card-base p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-semibold text-primary-500">
                    {account.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {account.bankName}
                    {account.accountHolder && (
                      <> · 예금주: {account.accountHolder}</>
                    )}
                  </p>
                  <p className="break-all text-sm font-medium text-gray-800">
                    {account.accountNumber}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <CopyButton
                    text={accountText}
                    label="복사"
                    className="text-xs"
                  />

                  {remittanceLink && (
                    <a
                      href={remittanceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#381e1f] transition-colors hover:text-[#111111]"
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#381e1f] text-[9px] font-bold text-[#ffe500]">
                        K
                      </span>
                      송금
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
