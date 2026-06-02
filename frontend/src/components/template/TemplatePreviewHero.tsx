"use client";

import { Template } from "@/types/template";
import Image from "next/image";
import { useState } from "react";
import InvitationAnimationOverlay from "@/components/invitation-view/InvitationAnimationOverlay";
import InvitationBgmPlayer from "@/components/invitation-view/InvitationBgmPlayer";
import InvitationSectionRenderer from "@/components/invitation-view/InvitationSectionRenderer";

interface TemplatePreviewHeroProps {
  template: Template;
}

export default function TemplatePreviewHero({
  template,
}: TemplatePreviewHeroProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImageUrl = template.previewImageUrl || template.thumbnailUrl;
  const showImage = Boolean(fallbackImageUrl) && !imageError;
  const masterInvitation = template.masterInvitation;
  const entranceAnimation =
    masterInvitation &&
    ["fade", "slide", "zoom"].includes(masterInvitation.animationType ?? "")
      ? masterInvitation.animationType
      : null;

  return (
    <div className="relative w-[390px] mx-auto">
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-xl" style={{ isolation: "isolate", height: "693px" }}>
        {masterInvitation ? (
          <div
            className="template-master-preview h-full w-full overflow-hidden invitation-themed"
            data-invitation-theme={masterInvitation.theme || "classic"}
            data-invitation-font={masterInvitation.fontFamily || "noto-sans"}
            {...(entranceAnimation ? { "data-anim": entranceAnimation } : {})}
          >
            <InvitationAnimationOverlay
              animationType={masterInvitation.animationType}
              contained
            />

            {masterInvitation.bgmUrl && (
              <InvitationBgmPlayer
                bgmUrl={masterInvitation.bgmUrl}
                className="absolute bottom-4 right-4 z-40"
              />
            )}

            <InvitationSectionRenderer
              invitation={masterInvitation}
              readOnlyInteractions
            />
          </div>
        ) : showImage ? (
          <Image
            src={fallbackImageUrl as string}
            alt={`${template.name} 미리보기`}
            fill
            onError={() => setImageError(true)}
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
