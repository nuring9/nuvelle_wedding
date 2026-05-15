export interface Template {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  previewImageUrl: string | null;
  themeKey: string | null;
  layoutKey: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}
