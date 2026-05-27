export interface AdminTemplate {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  previewImageUrl: string | null;
  themeKey: string | null;
  layoutKey: string | null;
  active: boolean;
  sortOrder: number;
  masterInvitationId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTemplateRequest {
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
  previewImageUrl?: string | null;
  themeKey?: string | null;
  layoutKey?: string | null;
  active?: boolean;
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
