export interface GuestPhotoResponse {
  id: number;
  imageUrl: string;
  uploaderName: string | null;
  message: string | null;
  createdAt: string;
}
