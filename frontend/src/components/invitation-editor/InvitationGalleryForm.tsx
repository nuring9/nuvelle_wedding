"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { uploadFile, deleteFile } from "@/lib/api/file";
import {
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImagePosition,
  type GalleryImageResponse,
  type UpdateInvitationRequest,
} from "@/lib/api/invitations";
import { GALLERY_LAYOUT_OPTIONS } from "@/constants/invitation";

interface InvitationGalleryFormProps {
  invitationId: number;
  galleries: GalleryImageResponse[];
  onGalleriesChange: (galleries: GalleryImageResponse[]) => void;
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationGalleryForm({
  invitationId,
  galleries,
  onGalleriesChange,
  data,
  onChange,
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

  const handlePositionChange = async (imageId: number, position: string) => {
    if (!accessToken) return;
    try {
      const updated = await updateGalleryImagePosition(invitationId, imageId, position, accessToken);
      onGalleriesChange(galleries.map((g) => (g.id === imageId ? updated : g)));
    } catch {
      setError("위치 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!accessToken) return;

    const image = galleries.find((g) => g.id === imageId);
    if (!image) return;

    try {
      await deleteGalleryImage(invitationId, imageId, accessToken);
      await deleteFile(image.imageUrl, accessToken);

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
              sizes="(max-width: 768px) 33vw, 140px"
              className="object-cover"
              style={{ objectPosition: image.objectPosition ?? "center" }}
            />
            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-1.5">
              {/* 위치 버튼 */}
              <div className="flex gap-1">
                {(["top", "center", "bottom"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => handlePositionChange(image.id, pos)}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium transition-colors ${
                      (image.objectPosition ?? "center") === pos
                        ? "bg-white text-gray-800"
                        : "bg-white/30 text-white hover:bg-white/60"
                    }`}
                  >
                    {pos === "top" ? "위" : pos === "center" ? "중" : "아래"}
                  </button>
                ))}
              </div>
              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                className="self-end"
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

      {/* 갤러리 레이아웃 */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="text-sm font-semibold text-gray-800">갤러리 레이아웃</h3>
        <div className="flex flex-col gap-2">
          {GALLERY_LAYOUT_OPTIONS.map((layout) => (
            <button
              key={layout.key}
              type="button"
              onClick={() => onChange({ galleryLayout: layout.key })}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                data.galleryLayout === layout.key
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{layout.icon}</span>
              <div className="flex flex-col gap-0.5 flex-1">
                <p className="text-sm font-medium text-gray-800">{layout.label}</p>
                <p className="text-xs text-gray-400">{layout.description}</p>
              </div>
              {data.galleryLayout === layout.key && (
                <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

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
