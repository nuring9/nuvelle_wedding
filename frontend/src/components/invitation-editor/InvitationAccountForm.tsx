"use client";

import { useState } from "react";
import InputField from "@/components/common/InputField";
import type {
  InvitationAccountInput,
  UpdateInvitationRequest,
} from "@/lib/api/invitations";

interface InvitationAccountFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

const ACCOUNT_FIELDS: InvitationAccountInput[] = [
  {
    side: "GROOM",
    label: "신랑",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
  {
    side: "BRIDE",
    label: "신부",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
  {
    side: "GROOM",
    label: "신랑 아버지",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
  {
    side: "GROOM",
    label: "신랑 어머니",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
  {
    side: "BRIDE",
    label: "신부 아버지",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
  {
    side: "BRIDE",
    label: "신부 어머니",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    remittanceLink: "",
  },
];

const REQUIRED_LABELS = ["신랑", "신부"];

function mergeAccounts(accounts: InvitationAccountInput[] = []) {
  return ACCOUNT_FIELDS.map((defaultAccount) => {
    const savedAccount = accounts.find(
      (account) =>
        account.side === defaultAccount.side &&
        account.label === defaultAccount.label,
    );

    return savedAccount ?? defaultAccount;
  });
}

function hasAccountValue(account: InvitationAccountInput) {
  return Boolean(
    account.bankName.trim() ||
      account.accountNumber.trim() ||
      account.accountHolder.trim() ||
      (account.remittanceLink ?? "").trim(),
  );
}

export default function InvitationAccountForm({
  data,
  onChange,
}: InvitationAccountFormProps) {
  const accounts = mergeAccounts(data.accounts);
  const [enabledOptionalLabels, setEnabledOptionalLabels] = useState<string[]>(
    () =>
      accounts
        .filter(
          (account) =>
            !REQUIRED_LABELS.includes(account.label) && hasAccountValue(account),
        )
        .map((account) => account.label),
  );

  const updateAccounts = (nextAccounts: InvitationAccountInput[]) => {
    onChange({ accounts: nextAccounts });
  };

  const updateAccount = (
    index: number,
    key: keyof InvitationAccountInput,
    value: string,
  ) => {
    const nextAccounts = accounts.map((account, accountIndex) =>
      accountIndex === index ? { ...account, [key]: value } : account,
    );

    updateAccounts(nextAccounts);
  };

  const clearAccount = (index: number) => {
    const nextAccounts = accounts.map((account, accountIndex) =>
      accountIndex === index
        ? {
            ...account,
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            remittanceLink: "",
          }
        : account,
    );

    updateAccounts(nextAccounts);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800">계좌번호</h3>
        <p className="text-xs text-gray-400">
          신랑·신부 계좌는 기본으로 입력할 수 있고, 부모님 계좌는 체크하면
          입력칸이 열립니다.
        </p>
      </div>

      {accounts.map((account, index) => {
        const isRequired = REQUIRED_LABELS.includes(account.label);
        const isChecked =
          isRequired || enabledOptionalLabels.includes(account.label);

        return (
          <div
            key={`${account.side}-${account.label}`}
            className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold text-gray-600">
                {account.label}
              </p>

              {!isRequired && (
                <label className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEnabledOptionalLabels((prev) => [
                          ...prev,
                          account.label,
                        ]);
                      } else {
                        setEnabledOptionalLabels((prev) =>
                          prev.filter((label) => label !== account.label),
                        );
                        clearAccount(index);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-primary-500"
                  />
                  계좌 입력
                </label>
              )}
            </div>

            {isChecked && (
              <>
                <InputField
                  label="은행명"
                  placeholder="예: 국민은행"
                  value={account.bankName ?? ""}
                  onChange={(e) =>
                    updateAccount(index, "bankName", e.target.value)
                  }
                />

                <InputField
                  label="계좌번호"
                  placeholder="예: 123-456-789012"
                  value={account.accountNumber ?? ""}
                  onChange={(e) =>
                    updateAccount(index, "accountNumber", e.target.value)
                  }
                />

                <InputField
                  label="예금주"
                  placeholder="예: 홍길동"
                  value={account.accountHolder ?? ""}
                  onChange={(e) =>
                    updateAccount(index, "accountHolder", e.target.value)
                  }
                />

                <InputField
                  label="카카오뱅크 송금 URL"
                  placeholder="https://..."
                  value={account.remittanceLink ?? ""}
                  onChange={(e) =>
                    updateAccount(index, "remittanceLink", e.target.value)
                  }
                  hint="이 계좌로 바로 송금할 수 있는 카카오뱅크 URL을 입력하세요."
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
