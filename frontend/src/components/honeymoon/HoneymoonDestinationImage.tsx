"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  searchDestinationImages,
  type UnsplashPhoto,
} from "@/lib/api/unsplash";
import { useAuthStore } from "@/stores/authStore";

interface HoneymoonDestinationImageProps {
  destination: string;
  className?: string;
}

export default function HoneymoonDestinationImage({
  destination,
  className = "",
}: HoneymoonDestinationImageProps) {
  const { accessToken } = useAuthStore();
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setPhoto(null);
      try {
        const photos = await searchDestinationImages(
          destination,
          1,
          accessToken ?? "",
        );
        if (photos.length > 0) setPhoto(photos[0]);
      } catch {
        // 조용히 실패
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [destination, accessToken]);

  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-br from-primary-100 to-blue-100 animate-pulse ${className}`}
      />
    );
  }

  if (!photo) {
    return (
      <div
        className={`bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center ${className}`}
      >
        <span className="text-4xl">✈️</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={photo.urls.regular}
        alt={photo.alt_description ?? destination}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Unsplash 저작권 표시 (필수) */}
      <div className="absolute bottom-2 right-2">
        <a
          href={`${photo.links.html}?utm_source=nuvelle&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 text-xs hover:text-white transition-colors"
        >
          Photo by {photo.user.name} on Unsplash
        </a>
      </div>
    </div>
  );
}
