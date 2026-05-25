import Image from "next/image";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationHeroSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationHeroSection({
  invitation,
}: InvitationHeroSectionProps) {
  const overlayText = invitation.mainOverlayText?.trim();

  return (
    <section className="relative w-full">
      {/* 메인 사진 */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        {invitation.mainImageUrl ? (
          <Image
            src={invitation.mainImageUrl}
            alt="웨딩 메인 사진"
            fill
            className="object-cover"
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
