"use client";

import TextareaField from "@/components/common/TextareaField";
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
    </div>
  );
}
