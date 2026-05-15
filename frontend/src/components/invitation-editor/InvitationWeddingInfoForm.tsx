"use client";

import InputField from "@/components/common/InputField";
import TextareaField from "@/components/common/TextareaField";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";

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
        <InputField
          label="예식 날짜"
          // 브라우저 기본 날짜 입력 UI 사용
          type="date"
          value={data.weddingDate ?? ""}
          onChange={(e) => onChange({ weddingDate: e.target.value })}
        />
        <InputField
          label="예식 시간"
          // 브라우저 기본 시간 입력 UI 사용
          type="time"
          value={data.weddingTime ?? ""}
          onChange={(e) => onChange({ weddingTime: e.target.value })}
        />
      </div>

      <InputField
        label="예식장명"
        placeholder="예: 그랜드볼룸 웨딩홀"
        value={data.venueName ?? ""}
        onChange={(e) => onChange({ venueName: e.target.value })}
      />

      <InputField
        label="주소"
        placeholder="예: 서울시 강남구 테헤란로 123"
        value={data.venueAddress ?? ""}
        onChange={(e) => onChange({ venueAddress: e.target.value })}
      />

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
