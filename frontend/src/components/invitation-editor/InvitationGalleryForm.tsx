"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { uploadFile } from "@/lib/api/file";
import {
  addGalleryImage,
  deleteGalleryImage,
  type GalleryImageResponse,
} from "@/lib/api/invitations";

interface InvitationGalleryFormProps {
  invitationId: number;
  galleries: GalleryImageResponse[];
  onGalleriesChange: (galleries: GalleryImageResponse[]) => void;
}

export default function InvitationGalleryForm({
  invitationId,
  galleries,
  onGalleriesChange,
}: InvitationGalleryFormProps) {
  const { accessToken } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !accessToken) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadFile(
          file,
          "invitations/gallery",
          accessToken,
        );
        const gallery = await addGalleryImage(
          invitationId,
          uploaded.url,
          accessToken,
        );
        onGalleriesChange([...galleries, gallery]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!accessToken) return;
    try {
      await deleteGalleryImage(invitationId, imageId, accessToken);
      onGalleriesChange(galleries.filter((g) => g.id !== imageId));
    } catch {
      setError("이미지 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">갤러리</h3>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {galleries.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
          >
            <Image
              src={image.imageUrl}
              alt="갤러리 이미지"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* 업로드 버튼 */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors flex flex-col items-center justify-center bg-gray-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <svg
              className="animate-spin h-5 w-5 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <>
              <svg
                className="w-6 h-6 text-gray-300 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs text-gray-400">추가</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400">여러 장 선택 가능 · 최대 10MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
