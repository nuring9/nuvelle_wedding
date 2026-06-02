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
  const [slideIndex, setSlideIndex] = useState(0);

  if (!invitation.galleryEnabled || invitation.galleries.length === 0) {
    return null;
  }

  const layout = invitation.galleryLayout ?? "grid";
  const galleries = invitation.galleries;

  return (
    <section className="section-padding">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Gallery
      </h2>

      {layout === "slider" ? (
        /* 슬라이드형 */
        <div className="relative">
          <div
            className="relative w-full bg-gray-100 overflow-hidden rounded-xl cursor-pointer"
            onClick={() => setSelectedImage(galleries[slideIndex].imageUrl)}
          >
            <Image
              src={galleries[slideIndex].imageUrl}
              alt="갤러리 사진"
              width={800}
              height={800}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>

          {/* 이전/다음 버튼 */}
          {galleries.length > 1 && (
            <>
              <button
                onClick={() => setSlideIndex((i) => (i - 1 + galleries.length) % galleries.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setSlideIndex((i) => (i + 1) % galleries.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                ›
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {galleries.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {galleries.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === slideIndex ? "bg-gray-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 그리드형 (기본) */
        <div className="grid grid-cols-3 gap-1">
          {galleries.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.imageUrl)}
              className="relative aspect-square bg-gray-100 overflow-hidden"
            >
              <Image
                src={image.imageUrl}
                alt="갤러리 사진"
                fill
                sizes="33vw"
                className="object-cover hover:scale-105 transition-transform duration-300"
                style={{ objectPosition: image.objectPosition ?? "center" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* 이미지 뷰어 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-sm" style={{ maxHeight: "90vh" }}>
            <Image
              src={selectedImage}
              alt="갤러리 사진 확대"
              width={800}
              height={800}
              sizes="(max-width: 640px) 100vw, 384px"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "90vh" }}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-gray-700"
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
