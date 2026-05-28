"use client";

import { Template } from "@/types/template";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(template.thumbnailUrl) && !imageError;

  return (
    <div className="card-base overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200">
      {/* 썸네일 */}
      <Link href={`/templates/${template.id}/preview`}>
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {showImage ? (
            <Image
              src={template.thumbnailUrl as string}
              alt={template.name}
              fill
              onError={() => setImageError(true)}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            // 썸네일 없을 때 플레이스홀더
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-champagne via-blush to-white px-4 text-center">
              <span className="text-4xl mb-2">💍</span>
              <span className="text-xs text-gray-500 font-serif">
                {template.name}
              </span>
            </div>
          )}

          {/* hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
              미리보기
            </span>
          </div>
        </div>
      </Link>

      {/* 하단 */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          {template.name}
        </h3>
        <Link
          href={`/templates/${template.id}/use`}
          className="btn-primary w-full text-center block py-2.5 text-xs"
        >
          이 템플릿 사용하기
        </Link>
      </div>
    </div>
  );
}
