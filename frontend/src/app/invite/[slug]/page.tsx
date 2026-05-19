import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicInvitation } from "@/lib/api/public";
import InvitationHeroSection from "@/components/invitation-view/InvitationHeroSection";
import InvitationCoupleSection from "@/components/invitation-view/InvitationCoupleSection";
import InvitationGreetingSection from "@/components/invitation-view/InvitationGreetingSection";
import InvitationWeddingInfoSection from "@/components/invitation-view/InvitationWeddingInfoSection";
import InvitationDdaySection from "@/components/invitation-view/InvitationDdaySection";
import InvitationGallerySection from "@/components/invitation-view/InvitationGallerySection";
import InvitationMapSection from "@/components/invitation-view/InvitationMapSection";
import InvitationAccountSection from "@/components/invitation-view/InvitationAccountSection";
import InvitationRsvpSection from "@/components/invitation-view/InvitationRsvpSection";
import InvitationGuestbookSection from "@/components/invitation-view/InvitationGuestbookSection";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const invitation = await getPublicInvitation(slug);
    const title =
      invitation.groomName && invitation.brideName
        ? `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`
        : "청첩장";
    return {
      title,
      description: invitation.greetingText?.slice(0, 100) ?? "모바일 청첩장",
      openGraph: {
        title,
        description: invitation.greetingText?.slice(0, 100) ?? "모바일 청첩장",
        images: invitation.mainImageUrl ? [invitation.mainImageUrl] : [],
      },
    };
  } catch {
    return { title: "청첩장" };
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;

  let invitation;
  try {
    invitation = await getPublicInvitation(slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="invitation-container">
        {/* 공개 청첩장 노출 순서 (문서 기준) */}

        {/* 1. 메인 사진 + 신랑♥신부 이름 */}
        <InvitationHeroSection invitation={invitation} />

        {/* 2. 신랑·신부 / 부모님 */}
        <InvitationCoupleSection invitation={invitation} />

        {/* 3. 인사말 */}
        <InvitationGreetingSection invitation={invitation} />

        {/* 4. 예식 날짜 / 시간 / 장소 */}
        <InvitationWeddingInfoSection invitation={invitation} />

        {/* 5. D-day */}
        <InvitationDdaySection invitation={invitation} />

        {/* 6. 갤러리 */}
        <InvitationGallerySection invitation={invitation} />

        {/* 7. 지도 / 오시는 길 */}
        <InvitationMapSection invitation={invitation} />

        {/* 8. 계좌번호 */}
        <InvitationAccountSection invitation={invitation} />

        {/* 9. RSVP */}
        <InvitationRsvpSection invitation={invitation} />

        {/* 10. 방명록 */}
        <InvitationGuestbookSection invitation={invitation} />

        {/* 하단 여백 */}
        <div className="pb-16 pb-safe" />
      </div>
    </div>
  );
}
