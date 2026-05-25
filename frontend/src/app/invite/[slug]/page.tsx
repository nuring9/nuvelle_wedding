import { notFound } from "next/navigation";
import KakaoSdkScript from "@/components/invitation-view/KakaoSdkScript";
import type { Metadata } from "next";
import { getPublicInvitation } from "@/lib/api/public";
import InvitationHeroSection from "@/components/invitation-view/InvitationHeroSection";
import InvitationCoupleSection from "@/components/invitation-view/InvitationCoupleSection";
import InvitationGreetingSection from "@/components/invitation-view/InvitationGreetingSection";
import InvitationWeddingInfoSection from "@/components/invitation-view/InvitationWeddingInfoSection";
import InvitationDdaySection from "@/components/invitation-view/InvitationDdaySection";
import InvitationGallerySection from "@/components/invitation-view/InvitationGallerySection";
import InvitationProfileSection from "@/components/invitation-view/InvitationProfileSection";
import InvitationInterviewSection from "@/components/invitation-view/InvitationInterviewSection";
import InvitationBgmPlayer from "@/components/invitation-view/InvitationBgmPlayer";
import InvitationGuestPhotoSection from "@/components/invitation-view/InvitationGuestPhotoSection";
import InvitationMapKakaoSection from "@/components/invitation-view/InvitationMapKakaoSection";
import InvitationQrSection from "@/components/invitation-view/InvitationQrSection";
import InvitationAccountSection from "@/components/invitation-view/InvitationAccountSection";
import InvitationRsvpSection from "@/components/invitation-view/InvitationRsvpSection";
import InvitationGuestbookSection from "@/components/invitation-view/InvitationGuestbookSection";
import InvitationAnimationOverlay from "@/components/invitation-view/InvitationAnimationOverlay";

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

const INVITATION_THEMES = [
  "classic",
  "minimal",
  "floral",
  "nature",
  "gold",
  "dark",
] as const;

const INVITATION_FONTS = ["noto-sans", "noto-serif", "playfair"] as const;

type InvitationTheme = (typeof INVITATION_THEMES)[number];
type InvitationFont = (typeof INVITATION_FONTS)[number];

function getInvitationTheme(theme: string | null): InvitationTheme {
  return INVITATION_THEMES.includes(
    theme as InvitationTheme,
  )
    ? (theme as InvitationTheme)
    : "classic";
}

function getInvitationFont(fontFamily: string | null): InvitationFont {
  return INVITATION_FONTS.includes(
    fontFamily as InvitationFont,
  )
    ? (fontFamily as InvitationFont)
    : "noto-sans";
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

  const theme = getInvitationTheme(invitation.theme);
  const font = getInvitationFont(invitation.fontFamily);

  return (
    <>
      <KakaoSdkScript />

      <div
        className="invitation-shell min-h-screen"
        data-invitation-theme={theme}
      >
        <div
          className="invitation-container invitation-themed"
          data-invitation-theme={theme}
          data-invitation-font={font}
        >
          <InvitationAnimationOverlay animationType={invitation.animationType} />

          {/* BGM 플레이어 */}
          {invitation.bgmUrl && (
            <InvitationBgmPlayer bgmUrl={invitation.bgmUrl} />
          )}

          {/* 1. 메인 사진 + 신랑♥신부 이름 */}
          <InvitationHeroSection invitation={invitation} />

          {/* 2. 신랑·신부 / 부모님 */}
          <InvitationCoupleSection invitation={invitation} />

          {/* 3. 프로필형 소개 */}
          <InvitationProfileSection invitation={invitation} />

          {/* 4. 인사말 */}
          <InvitationGreetingSection invitation={invitation} />

          {/* 5. 예식 날짜 / 시간 / 장소 */}
          <InvitationWeddingInfoSection invitation={invitation} />

          {/* 6. D-day */}
          <InvitationDdaySection invitation={invitation} />

          {/* 7. 웨딩 인터뷰 */}
          <InvitationInterviewSection invitation={invitation} />

          {/* 8. 갤러리 */}
          <InvitationGallerySection invitation={invitation} />

          {/* 9. 지도 / 오시는 길 (카카오맵 SDK) */}
          <InvitationMapKakaoSection invitation={invitation} />

          {/* 10. 계좌번호 + 카카오뱅크 송금 링크 */}
          <InvitationAccountSection invitation={invitation} />

          {/* 11. RSVP */}
          <InvitationRsvpSection invitation={invitation} />

          {/* 12. 방명록 */}
          <InvitationGuestbookSection invitation={invitation} />

          {/* 13. 게스트 사진 */}
          <InvitationGuestPhotoSection invitation={invitation} />

          {/* 14. QR 코드 */}
          <InvitationQrSection invitation={invitation} />

          {/* 하단 여백 */}
          <div className="pb-16 pb-safe" />
        </div>
      </div>
    </>
  );
}
