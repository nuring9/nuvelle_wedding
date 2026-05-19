export interface GalleryImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
}

// 공개 청첩장 상태 타입
export interface PublicInvitation {
  id: number;
  slug: string;
  templateId: string;
  themeKey: string | null;
  mainImageUrl: string | null;
  groomName: string | null;
  brideName: string | null;
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
  bgmUrl: string | null;
  galleries: GalleryImage[];
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
