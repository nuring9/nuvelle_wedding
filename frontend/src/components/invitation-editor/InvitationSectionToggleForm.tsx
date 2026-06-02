"use client";

import ToggleSwitch from "@/components/common/ToggleSwitch";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";
import InvitationSectionOrderForm from "./InvitationSectionOrderForm";

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
      key: "contactEnabled" as const,
      label: "연락처",
      description: "신랑·신부 전화 아이콘 표시",
    },
    {
      key: "calendarEnabled" as const,
      label: "달력",
      description: "예식 날짜 달력 표시",
    },
    {
      key: "interviewEnabled" as const,
      label: "웨딩 인터뷰",
      description: "신랑신부 인터뷰 섹션 표시",
    },
    {
      key: "galleryEnabled" as const,
      label: "갤러리",
      description: "사진 갤러리 섹션 표시",
    },
    {
      key: "photoBannerEnabled" as const,
      label: "포토 배너",
      description: "원하는 위치에 사진을 배너로 삽입",
    },
    {
      key: "accountEnabled" as const,
      label: "계좌번호",
      description: "축의금 계좌 안내 표시",
    },
    {
      key: "ddayEnabled" as const,
      label: "D-day",
      description: "예식까지 남은 날 표시",
    },
    {
      key: "rsvpEnabled" as const,
      label: "RSVP 참석 여부",
      description: "참석 여부 확인 폼 표시",
    },
    {
      key: "guestbookEnabled" as const,
      label: "방명록",
      description: "하객 방명록 섹션 표시",
    },
    {
      key: "guestPhotoEnabled" as const,
      label: "게스트 사진",
      description: "하객 사진 업로드 섹션 표시",
    },
    {
      key: "qrEnabled" as const,
      label: "QR 코드",
      description: "청첩장 QR 코드 섹션 표시",
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

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="flex">
            <span className="shrink-0">*&nbsp;&nbsp;</span>
            <span>
              메인 사진, 신랑·신부, 인사말, 예식 정보, 오시는 길은<br />
              필수 섹션으로 표시 여부를 변경할 수 없습니다.
            </span>
          </span>
        </p>
      </div>

      <InvitationSectionOrderForm
        sectionOrder={data.sectionOrder}
        onChange={(sectionOrder) => onChange({ sectionOrder })}
      />
    </div>
  );
}
