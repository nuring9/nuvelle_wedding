export interface AdminTemplate {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  previewImageUrl: string | null;
  themeKey: string | null;
  layoutKey: string | null;
  description: string | null;
  active: boolean;
  sortOrder: number;
  masterInvitationId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTemplateRequest {
  name: string;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  themeKey?: string | null;
  layoutKey?: string | null;
  description?: string | null;
  active?: boolean;
  sortOrder?: number;
}

export interface AdminBgm {
  id: number;
  title: string;
  fileUrl: string;
  mood: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface AdminBgmRequest {
  title: string;
  fileUrl: string;
  mood?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminInvitationSummary {
  invitationId: number;
  title: string | null;
  slug: string;
  publicUrl: string;
  status: "DRAFT" | "PRIVATE" | "PUBLISHED";
  publishedAt: string | null;
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  venueName: string | null;
  userId: number;
  userName: string;
  userEmail: string;
  templateName: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ROLE_USER" | "ROLE_ADMIN";
export type UserStatus = "ACTIVE" | "WITHDRAWN" | "SUSPENDED";
export type AuthProvider = "LOCAL" | "KAKAO";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  invitationCount: number | null;
}
