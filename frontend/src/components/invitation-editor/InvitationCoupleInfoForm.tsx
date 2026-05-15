"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import InputField from "../common/InputField";

interface InvitationCoupleInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationCoupleInfoForm({
  data,
  onChange,
}: InvitationCoupleInfoFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800"> 신랑 · 신부</h3>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="신랑 이름"
          placeholder="신랑 이름"
          value={data.groomName ?? ""}
          onChange={(e) => onChange({ groomName: e.target.value })}
        />
        <InputField
          label="신부 이름"
          placeholder="신부 이름"
          value={data.brideName ?? ""}
          onChange={(e) => onChange({ brideName: e.target.value })}
        />
      </div>
    </div>
  );
}
