export interface GalleryImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  objectPosition: string;
}

// 계좌
export interface InvitationAccount {
  side: "GROOM" | "BRIDE" | string;
  label: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  remittanceLink?: string | null;
}

// 공개 청첩장 상태 타입
export interface PublicInvitation {
  id: number;
  slug: string;
  templateId: string;
  themeKey: string | null;
  mainImageUrl: string | null;
  mainOverlayText: string | null;
  mainImagePosition: string | null;
  groomName: string | null;
  brideName: string | null;
  groomPhone: string | null;
  bridePhone: string | null;
  contactEnabled: boolean;
  groomIntroduction: string | null;
  brideIntroduction: string | null;
  groomFatherName: string | null;
  groomMotherName: string | null;
  brideFatherName: string | null;
  brideMotherName: string | null;
  greetingText: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueDetail: string | null;
  transportInfo: string | null;
  mapLat: number | null;
  mapLng: number | null;
  accountBank: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  accounts: InvitationAccount[];
  galleryEnabled: boolean;
  rsvpEnabled: boolean;
  guestbookEnabled: boolean;
  accountEnabled: boolean;
  parentsEnabled: boolean;
  ddayEnabled: boolean;
  theme: string | null;
  fontFamily: string | null;
  galleryLayout: string | null;
  animationType: string | null;
  bgmId: number | null;
  bgmUrl: string | null;
  bgmTitle: string | null;
  remittanceLink: string | null;
  interviewEnabled: boolean;
  guestPhotoEnabled: boolean;
  photoBannerEnabled: boolean;
  photoBannerUrl: string | null;
  photoBannerPosition: string | null;
  galleries: GalleryImage[];
  sectionOrder: string[];
}

// RSVP 등록 요청
export interface RsvpRequest {
  guestName: string;
  attendanceStatus: "ATTENDING" | "NOT_ATTENDING" | "UNDECIDED";
  guestCount: number;
  message?: string;
  phone?: string;
}

// RSVP 응답
export interface RsvpResponse {
  id: number;
  guestName: string;
  attendanceStatus: "ATTENDING" | "NOT_ATTENDING" | "UNDECIDED";
  guestCount: number;
  message: string | null;
  phone: string | null;
  createdAt: string;
}

// 방명록 등록 요청
export interface GuestbookRequest {
  guestName: string;
  message: string;
}

// 방명록 응답
export interface GuestbookResponse {
  id: number;
  guestName: string;
  message: string;
  isHidden: boolean;
  createdAt: string;
}
