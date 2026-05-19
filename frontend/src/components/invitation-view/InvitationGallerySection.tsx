"use client";

import { useState } from "react";
import Image from "next/image";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationGallerySectionProps {
  invitation: PublicInvitation;
}

export default function InvitationGallerySection({
  invitation,
}: InvitationGallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!invitation.galleryEnabled || invitation.galleries.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Gallery
      </h2>

      {/* 그리드 갤러리 */}
      <div className="grid grid-cols-3 gap-1">
        {invitation.galleries.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image.imageUrl)}
            className="relative aspect-square bg-gray-100 overflow-hidden"
          >
            <Image
              src={image.imageUrl}
              alt="갤러리 사진"
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {/* 이미지 뷰어 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-sm aspect-square">
            <Image
              src={selectedImage}
              alt="갤러리 사진 확대"
              fill
              className="object-contain"
            />
          </div>
          <button
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
