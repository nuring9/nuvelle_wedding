"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadGuestPhoto, getGuestPhotos } from "@/lib/api/guestPhoto";
import type { GuestPhotoResponse } from "@/types/guestPhoto";
import type { PublicInvitation } from "@/types/invitation";
import InputField from "@/components/common/InputField";
import PrimaryButton from "@/components/common/PrimaryButton";

interface InvitationGuestPhotoSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationGuestPhotoSection({
  invitation,
}: InvitationGuestPhotoSectionProps) {
  const [photos, setPhotos] = useState<GuestPhotoResponse[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!invitation.guestPhotoEnabled) return;
    const fetch = async () => {
      const data = await getGuestPhotos(invitation.slug);
      setPhotos(data);
    };
    fetch();
  }, [invitation.slug, invitation.guestPhotoEnabled]);

  if (!invitation.guestPhotoEnabled) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const photo = await uploadGuestPhoto(
        invitation.slug,
        file,
        uploaderName || undefined,
        message || undefined,
      );
      setPhotos((prev) => [photo, ...prev]);
      setUploaderName("");
      setMessage("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("사진 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="section-padding section-tone-guest-photo">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Guest Photos
      </h2>

      {/* 업로드 폼 */}
      <div className="card-base p-5 mb-6 flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-600">사진 남기기</p>

        <InputField
          placeholder="이름 (선택)"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
        />
        <InputField
          placeholder="메시지 (선택)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <PrimaryButton
          type="button"
          onClick={() => inputRef.current?.click()}
          isLoading={isUploading}
          fullWidth
        >
          사진 선택하기
        </PrimaryButton>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 사진 그리드 */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedImage(photo.imageUrl)}
              className="relative aspect-square bg-gray-100 overflow-hidden"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.uploaderName ?? "게스트 사진"}
                fill
                sizes="33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}

      {/* 이미지 뷰어 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-sm aspect-square">
            <Image
              src={selectedImage}
              alt="게스트 사진 확대"
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              className="w-6 h-6"
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
        </div>
      )}
    </section>
  );
}
