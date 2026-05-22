"use client";

import TextareaField from "@/components/common/TextareaField";
import InputField from "@/components/common/InputField";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";

interface InvitationProfileFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationProfileForm({
  data,
  onChange,
}: InvitationProfileFormProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 신랑 소개 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">신랑 소개</h3>
        <TextareaField
          placeholder="신랑을 소개하는 글을 입력해주세요."
          value={data.groomIntroduction ?? ""}
          onChange={(e) => onChange({ groomIntroduction: e.target.value })}
          rows={4}
        />
      </div>

      {/* 신부 소개 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">신부 소개</h3>
        <TextareaField
          placeholder="신부를 소개하는 글을 입력해주세요."
          value={data.brideIntroduction ?? ""}
          onChange={(e) => onChange({ brideIntroduction: e.target.value })}
          rows={4}
        />
      </div>

      {/* 송금 링크 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">송금 링크</h3>
        <InputField
          label="카카오페이 / 토스 등 송금 링크"
          placeholder="https://qr.kakaopay.com/..."
          value={data.remittanceLink ?? ""}
          onChange={(e) => onChange({ remittanceLink: e.target.value })}
          hint="하객이 바로 송금할 수 있는 링크를 입력해주세요."
        />
      </div>
    </div>
  );
}
