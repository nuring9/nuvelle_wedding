"use client";

import type { CSSProperties } from "react";

interface InvitationAnimationOverlayProps {
  animationType: string | null;
}

const EFFECT_ITEMS = Array.from({ length: 18 }, (_, index) => index);

export default function InvitationAnimationOverlay({
  animationType,
}: InvitationAnimationOverlayProps) {
  if (
    animationType !== "sparkle" &&
    animationType !== "leaves" &&
    animationType !== "cherry-blossom"
  ) {
    return null;
  }

  return (
    <div
      className={`invitation-animation-overlay invitation-animation-${animationType}`}
      aria-hidden="true"
    >
      {EFFECT_ITEMS.map((item) => (
        <span key={item} style={{ "--effect-index": item } as CSSProperties} />
      ))}
    </div>
  );
}
