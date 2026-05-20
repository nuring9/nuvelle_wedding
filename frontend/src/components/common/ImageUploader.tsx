"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/lib/api/file";
import { useAuthStore } from "@/stores/authStore";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string) => void;
  onDelete?: () => void;
  directory: string;
  aspect?: "square" | "portrait" | "landscape";
  placeholder?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  value,
  onChange,
  onDelete,
  directory,
  aspect = "square",
  placeholder = "이미지 업로드",
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const { accessToken } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[aspect];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    // 클라이언트 사이드 크기 검증
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    // 확장자 검증
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? "")) {
      setError("JPG, PNG, WEBP, GIF 형식만 업로드 가능합니다.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await uploadFile(file, directory, accessToken);
      onChange(result.url);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      // input 초기화 (같은 파일 재업로드 허용)
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    onDelete?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative ${aspectClass} rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="업로드된 이미지"
              fill
              className="object-cover"
            />
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 재업로드 오버레이 */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end justify-center pb-3 opacity-0 hover:opacity-100"
            >
              <span className="text-white text-xs bg-black/40 px-3 py-1 rounded-full">
                변경
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-primary-400"
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
                <span className="text-xs text-gray-400">업로드 중...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-gray-400">{placeholder}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
