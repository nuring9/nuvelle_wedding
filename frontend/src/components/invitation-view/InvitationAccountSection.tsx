"use client";

import { useState } from "react";
import type { PublicInvitation } from "@/types/invitation";
import CopyButton from "@/components/common/CopyButton";

interface InvitationAccountSectionProps {
  invitation: PublicInvitation;
}

interface AccountItemProps {
  label: string;
  bankName: string;
  accountHolder?: string;
  accountNumber: string;
  accountText: string;
  remittanceLink?: string;
}

function AccountItem({
  label,
  bankName,
  accountHolder,
  accountNumber,
  accountText,
  remittanceLink,
}: AccountItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        className="w-full flex items-center justify-between py-2.5 px-2 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs font-medium text-primary-500">{label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="pb-4 px-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="account-bank-info text-xs text-gray-400">
                {bankName}
                {accountHolder && <> · 예금주: {accountHolder}</>}
              </p>
              <p className="break-all text-xs font-medium text-gray-700">
                {accountNumber}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <CopyButton text={accountText} label="복사" className="text-xs" />

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
      )}
    </div>
  );
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
        <p className="mt-3 text-xs leading-loose text-gray-600">
          축하의 마음을 전하고 싶으신 분들을 위해
          <br /> 계좌 정보를 안내드립니다.
        </p>
      </div>

      <div className="flex flex-col border-t border-gray-200 mx-6">
        {accounts.map((account, index) => {
          const accountText = `${account.bankName} ${account.accountNumber} ${
            account.accountHolder || ""
          }`;
          const remittanceLink =
            account.remittanceLink || invitation.remittanceLink;

          return (
            <AccountItem
              key={`${account.side}-${account.label}-${index}`}
              label={account.label}
              bankName={account.bankName}
              accountHolder={account.accountHolder}
              accountNumber={account.accountNumber}
              accountText={accountText}
              remittanceLink={remittanceLink ?? undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
