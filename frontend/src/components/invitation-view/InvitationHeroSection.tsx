"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationHeroSectionProps {
  invitation: PublicInvitation;
  editableMainImagePosition?: boolean;
  onMainImagePositionChange?: (position: string) => void;
}

export default function InvitationHeroSection({
  invitation,
  editableMainImagePosition = false,
  onMainImagePositionChange,
}: InvitationHeroSectionProps) {
  const overlayText = invitation.mainOverlayText?.trim();
  const dragStartRef = useRef<{
    y: number;
    positionY: number;
    pointerId: number;
  } | null>(null);

  const getPositionY = () => {
    const position = invitation.mainImagePosition ?? "50% 50%";
    const y = Number(position.split(" ")[1]?.replace("%", ""));
    return Number.isFinite(y) ? y : 50;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editableMainImagePosition) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    dragStartRef.current = {
      y: e.clientY,
      positionY: getPositionY(),
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editableMainImagePosition || !dragStartRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaPercent = (deltaY / rect.height) * 100;
    const nextY = Math.min(
      100,
      Math.max(0, dragStartRef.current.positionY - deltaPercent),
    );

    onMainImagePositionChange?.(`50% ${Math.round(nextY)}%`);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      dragStartRef.current &&
      e.currentTarget.hasPointerCapture(dragStartRef.current.pointerId)
    ) {
      e.currentTarget.releasePointerCapture(dragStartRef.current.pointerId);
    }

    dragStartRef.current = null;
  };

  useEffect(() => {
    if (!editableMainImagePosition) {
      dragStartRef.current = null;
    }
  }, [editableMainImagePosition]);

  const positionDragHandlers = editableMainImagePosition
    ? {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
      }
    : {};

  return (
    <section className="relative w-full">
      {/* 메인 사진 */}
      <div
        className={`main-image-animation-target relative w-full aspect-[3/4] bg-gray-100 ${
          editableMainImagePosition ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{ touchAction: editableMainImagePosition ? "none" : undefined }}
        {...positionDragHandlers}
      >
        {invitation.mainImageUrl ? (
          <Image
            src={invitation.mainImageUrl}
            alt="웨딩 메인 사진"
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            style={{
              objectPosition: invitation.mainImagePosition ?? "50% 50%",
            }}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-gray-400">
              메인 사진을 등록해주세요
            </span>
          </div>
        )}

        {overlayText && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 text-center text-white">
              <p className="main-overlay-script text-5xl leading-none drop-shadow-sm opacity-80">
                {overlayText}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
