"use client";

import { useRef } from "react";
import Image from "next/image";
import type { PublicInvitation } from "@/types/invitation";

interface Props {
  invitation: PublicInvitation;
  editablePosition?: boolean;
  onPositionChange?: (position: string) => void;
}

export default function InvitationPhotoBannerSection({
  invitation,
  editablePosition = false,
  onPositionChange,
}: Props) {
  const dragStartRef = useRef<{
    y: number;
    positionY: number;
    pointerId: number;
  } | null>(null);

  if (!invitation.photoBannerEnabled || !invitation.photoBannerUrl) return null;

  const getPositionY = () => {
    const position = invitation.photoBannerPosition ?? "50% 50%";
    const y = Number(position.split(" ")[1]?.replace("%", ""));
    return Number.isFinite(y) ? y : 50;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editablePosition) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { y: e.clientY, positionY: getPositionY(), pointerId: e.pointerId };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editablePosition || !dragStartRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const deltaY = e.clientY - dragStartRef.current.y;
    const deltaPercent = (deltaY / rect.height) * 100;
    const nextY = Math.min(100, Math.max(0, dragStartRef.current.positionY - deltaPercent));
    onPositionChange?.(`50% ${Math.round(nextY)}%`);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current && e.currentTarget.hasPointerCapture(dragStartRef.current.pointerId)) {
      e.currentTarget.releasePointerCapture(dragStartRef.current.pointerId);
    }
    dragStartRef.current = null;
  };

  const dragHandlers = editablePosition
    ? { onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, onPointerCancel: handlePointerUp }
    : {};

  return (
    <section className="relative w-full">
      <div
        className={`relative w-full aspect-[3/2] overflow-hidden bg-gray-100 ${editablePosition ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ touchAction: editablePosition ? "none" : undefined }}
        {...dragHandlers}
      >
        <Image
          src={invitation.photoBannerUrl}
          alt="포토 배너"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: invitation.photoBannerPosition ?? "50% 50%" }}
        />
      </div>
    </section>
  );
}
