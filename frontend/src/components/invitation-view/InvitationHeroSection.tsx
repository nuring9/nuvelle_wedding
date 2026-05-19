import Image from "next/image";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationHeroSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationHeroSection({
  invitation,
}: InvitationHeroSectionProps) {
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
          <div className="w-full h-full bg-gradient-to-b from-champagne to-blush flex items-center justify-center">
            <span className="text-6xl">💍</span>
          </div>
        )}

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* 이름 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center text-white">
          <p className="text-sm tracking-widest mb-3 opacity-80">WEDDING</p>
          <h1 className="text-3xl font-display font-semibold tracking-wide">
            {invitation.groomName || "신랑"}{" "}
            <span className="text-primary-300 mx-2">♥</span>{" "}
            {invitation.brideName || "신부"}
          </h1>
        </div>
      </div>
    </section>
  );
}
