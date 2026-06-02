// 청첩장에서 사용할 수 있는 섹션 ID 목록
export type InvitationSectionId =
  | "hero"
  | "couple"
  | "greeting"
  | "weddingInfo"
  | "calendar"
  | "dday"
  | "interview"
  | "gallery"
  | "photoBanner"
  | "map"
  | "account"
  | "rsvp"
  | "guestbook"
  | "guestPhoto"
  | "qr";

// 섹션 on/off 여부를 확인할 때 사용할 PublicInvitation의 boolean key 목록
export type InvitationSectionEnabledKey =
  | "galleryEnabled"
  | "rsvpEnabled"
  | "guestbookEnabled"
  | "accountEnabled"
  | "ddayEnabled"
  | "interviewEnabled"
  | "guestPhotoEnabled"
  | "photoBannerEnabled"
  | "calendarEnabled"
  | "qrEnabled";

// 섹션 하나의 설정 구조.
export interface InvitationSectionConfig {
  id: InvitationSectionId;
  label: string;
  enabledKey?: InvitationSectionEnabledKey;
  fixed?: boolean;
}

// 청첩장 전체 섹션 목록. (기본 섹션 순서)
export const INVITATION_SECTIONS: InvitationSectionConfig[] = [
  { id: "hero", label: "메인 사진", fixed: true },
  { id: "couple", label: "신랑·신부" },
  { id: "greeting", label: "인사말" },
  { id: "weddingInfo", label: "예식 정보" },
  { id: "dday", label: "D-day", enabledKey: "ddayEnabled" },
  { id: "calendar", label: "달력", enabledKey: "calendarEnabled" },
  { id: "interview", label: "웨딩 인터뷰", enabledKey: "interviewEnabled" },
  { id: "gallery", label: "갤러리", enabledKey: "galleryEnabled" },
  { id: "account", label: "계좌번호", enabledKey: "accountEnabled" },
  { id: "rsvp", label: "RSVP 참석 여부", enabledKey: "rsvpEnabled" },
  { id: "photoBanner", label: "포토 배너", enabledKey: "photoBannerEnabled" },
  { id: "guestbook", label: "방명록", enabledKey: "guestbookEnabled" },
  { id: "guestPhoto", label: "게스트 사진", enabledKey: "guestPhotoEnabled" },
  { id: "map", label: "오시는 길" },
  { id: "qr", label: "QR 코드", enabledKey: "qrEnabled" },
];

// 기본 섹션 순서. INVITATION_SECTIONS 배열에서 id만
export const DEFAULT_INVITATION_SECTION_ORDER = INVITATION_SECTIONS.map(
  (section) => section.id,
);

// 백엔드에서 받은 sectionOrder를 안전한 순서 배열로 정리.
export function normalizeInvitationSectionOrder(
  sectionOrder?: string[] | null,
): InvitationSectionId[] {
  const validIds = new Set(INVITATION_SECTIONS.map((section) => section.id));

  const nextOrder = (sectionOrder ?? []).filter(
    (id): id is InvitationSectionId => validIds.has(id as InvitationSectionId),
  );

  const missingIds = DEFAULT_INVITATION_SECTION_ORDER.filter(
    (id) => !nextOrder.includes(id),
  );

  // 저장된 순서를 먼저 사용하고, 빠진 섹션은 뒤에.
  return [...nextOrder, ...missingIds];
}
