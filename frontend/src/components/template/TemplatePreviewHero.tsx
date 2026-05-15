import { Template } from "@/types/template";
import Image from "next/image";

interface TemplatePreviewHeroProps {
  template: Template;
}

export default function TemplatePreviewHero({
  template,
}: TemplatePreviewHeroProps) {
  return (
    <div className="relative w-full max-w-[430px] mx-auto">
      <div className="relative aspect-[9/16] bg-gray-100 rounded-2xl overflow-hidden shadow-xl">
        {template.previewImageUrl ? (
          <Image
            src={template.previewImageUrl}
            alt={`${template.name} 미리보기`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          // 미리보기 이미지가 없을 때 보여줄 기본 화면
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-champagne via-blush to-white">
            <span>💍</span>
            <p className="font-display text-2xl text-gray-600 mb-2">
              {template.name}
            </p>
            <p className="text-sm text-gray-400 font-serif">
              미리보기 준비 중입니다
            </p>
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none" />
    </div>
  );
}
