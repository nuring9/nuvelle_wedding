"use client";

import ToggleSwitch from "@/components/common/ToggleSwitch";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";

interface InvitationSectionToggleFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationSectionToggleForm({
  data,
  onChange,
}: InvitationSectionToggleFormProps) {
  const sections = [
    {
      key: "parentsEnabled" as const,
      label: "부모님 정보",
      description: "신랑·신부 부모님 성함 표시",
    },
    {
      key: "galleryEnabled" as const,
      label: "갤러리",
      description: "사진 갤러리 섹션 표시",
    },
    {
      key: "ddayEnabled" as const,
      label: "D-day",
      description: "예식까지 남은 날 표시",
    },
    {
      key: "accountEnabled" as const,
      label: "계좌번호",
      description: "축의금 계좌 안내 표시",
    },
    {
      key: "rsvpEnabled" as const,
      label: "RSVP",
      description: "참석 여부 확인 폼 표시",
    },
    {
      key: "guestbookEnabled" as const,
      label: "방명록",
      description: "하객 방명록 섹션 표시",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">섹션 설정</h3>
      <div className="flex flex-col gap-4 divide-y divide-gray-100">
        {sections.map((section) => (
          <div key={section.key} className="pt-4 first:pt-0">
            <ToggleSwitch
              checked={data[section.key] ?? false}
              onChange={(checked) => onChange({ [section.key]: checked })}
              label={section.label}
              description={section.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
