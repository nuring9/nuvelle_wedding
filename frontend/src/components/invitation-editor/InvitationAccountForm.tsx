"use client";

import InputField from "@/components/common/InputField";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";

interface InvitationAccountFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationAccountForm({
  data,
  onChange,
}: InvitationAccountFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">계좌번호</h3>

      <InputField
        label="은행명"
        placeholder="예: 국민은행"
        value={data.accountBank ?? ""}
        onChange={(e) => onChange({ accountBank: e.target.value })}
      />
      <InputField
        label="계좌번호"
        placeholder="예: 123-456-789012"
        value={data.accountNumber ?? ""}
        onChange={(e) => onChange({ accountNumber: e.target.value })}
      />
      <InputField
        label="예금주"
        placeholder="예: 홍길동"
        value={data.accountHolder ?? ""}
        onChange={(e) => onChange({ accountHolder: e.target.value })}
      />
    </div>
  );
}
