"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import Image from "next/image";

interface InvitationBasicInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
  onImageUpload: (file: File, field: "mainImageUrl") => Promise<void>;
  isUploading?: boolean;
}

export default function InvitationBasicInfoForm({
  data,
  onChange,
  onImageUpload,
  isUploading = false,
}: InvitationBasicInfoFormProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    await onImageUpload(file, "mainImageUrl");
  };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">메인 사진</h3>
        <div className="relative aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors">
          {data.mainImageUrl ? (
            <>
              <Image
                src={data.mainImageUrl}
                alt="메인 사진"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onChange({ mainImageUrl: "" })}
                className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <svg
                  className="w-3 h-3"
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
            </>
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
              {isUploading ? (
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
              ) : (
                <>
                  <svg
                    className="w-8 h-8 text-gray-300 mb-2"
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
                  <span className="text-xs text-gray-400">사진 업로드</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          JPG, PNG 권장 · 최대 10MB
        </p>
      </div>
    </div>
  );
}
