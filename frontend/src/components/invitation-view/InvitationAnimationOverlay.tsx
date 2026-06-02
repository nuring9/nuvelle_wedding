"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

interface InvitationAnimationOverlayProps {
  animationType: string | null;
  contained?: boolean;
}

const PARTICLE_COUNT = 12;
const GOLD_SPARKLE_COUNT = 7;
const ENTRANCE_TYPES = ["fade", "slide", "zoom"] as const;
const PARTICLE_TYPES = [
  "sparkle",
  "snow",
  "gold-dust",
  "gold-sparkle",
  "leaves",
  "cherry-blossom",
] as const;

export default function InvitationAnimationOverlay({
  animationType,
  contained = false,
}: InvitationAnimationOverlayProps) {
  useEffect(() => {
    if (
      !ENTRANCE_TYPES.includes(
        animationType as (typeof ENTRANCE_TYPES)[number],
      )
    ) {
      return;
    }

    const container = document.querySelector<HTMLElement>("[data-anim]");
    if (!container) return;

    const observedElements = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("anim-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
    );

    const observeElements = () => {
      const selector =
        animationType === "fade" ? "section" : ".main-image-animation-target";
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(selector),
      );

      elements.forEach((element) => {
        if (observedElements.has(element)) return;

        observedElements.add(element);
        observer.observe(element);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [animationType]);

  if (!PARTICLE_TYPES.includes(animationType as (typeof PARTICLE_TYPES)[number])) {
    return null;
  }

  const effectClass = animationType === "gold-dust" ? "snow" : animationType;
  const particleCount =
    animationType === "gold-sparkle" ? GOLD_SPARKLE_COUNT : PARTICLE_COUNT;

  return (
    <div
      className={`invitation-animation-overlay ${
        contained ? "invitation-animation-overlay-contained" : ""
      } invitation-animation-${effectClass}`}
      aria-hidden="true"
    >
      {Array.from({ length: particleCount }, (_, i) => (
        <span key={i} style={{ "--effect-index": i } as CSSProperties} />
      ))}
    </div>
  );
}
