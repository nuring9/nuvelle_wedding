"use client";

import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import DatePicker from "@/components/common/DatePicker";
import TimePicker from "@/components/common/TimePicker";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";
import InvitationMapForm from "./InvitationMapForm";

interface InvitationWeddingInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationWeddingInfoForm({
  data,
  onChange,
}: InvitationWeddingInfoFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">예식 정보</h3>

      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          label="예식 날짜"
          value={data.weddingDate ?? ""}
          onChange={(v) => onChange({ weddingDate: v })}
        />
        <TimePicker
          label="예식 시간"
          value={data.weddingTime ?? ""}
          onChange={(v) => onChange({ weddingTime: v })}
        />
      </div>

      <InputField
        label="예식장명"
        placeholder="예: 그랜드볼룸 웨딩홀"
        value={data.venueName ?? ""}
        onChange={(e) => onChange({ venueName: e.target.value })}
      />

      <InvitationMapForm data={data} onChange={onChange} />

      <InputField
        label="상세 위치"
        placeholder="예: 3층 그랜드홀"
        value={data.venueDetail ?? ""}
        onChange={(e) => onChange({ venueDetail: e.target.value })}
      />

      <TextareaField
        label="오시는 길"
        placeholder="대중교통, 자가용 이용 안내를 입력해주세요."
        value={data.transportInfo ?? ""}
        onChange={(e) => onChange({ transportInfo: e.target.value })}
        rows={4}
      />
    </div>
  );
}
