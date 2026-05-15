"use client";

import { GalleryImageResponse } from "@/lib/api/invitations";
import Image from "next/image";

interface InvitationGalleryFormProps {
  galleries: GalleryImageResponse[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (imageId: number) => Promise<void>;
  isUploading?: boolean;
}

export default function InvitationGalleryForm({
  galleries,
  onUpload,
  onDelete,
  isUploading = false,
}: InvitationGalleryFormProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      await onUpload(file);
    }
    e.target.value = "";
  };
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">갤러리</h3>
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
            {/* 이미지 위 덮는 삭제 버튼 */}
            <button
              type="button"
              onClick={() => onDelete(image.id)}
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

        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50">
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
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      <p className="text-xs text-gray-400">
        이미지를 여러 장 선택할 수 있습니다. 최대 10MB
      </p>
    </div>
  );
}
