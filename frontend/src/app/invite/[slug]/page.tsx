import { notFound } from "next/navigation";
import type { Metadata } from "next";

import KakaoSdkScript from "@/components/invitation-view/KakaoSdkScript";
import InvitationAnimationOverlay from "@/components/invitation-view/InvitationAnimationOverlay";
import InvitationBgmPlayer from "@/components/invitation-view/InvitationBgmPlayer";
import InvitationSectionRenderer from "@/components/invitation-view/InvitationSectionRenderer";
import { getPublicInvitation } from "@/lib/api/public";

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
  return INVITATION_THEMES.includes(theme as InvitationTheme)
    ? (theme as InvitationTheme)
    : "classic";
}

function getInvitationFont(fontFamily: string | null): InvitationFont {
  return INVITATION_FONTS.includes(fontFamily as InvitationFont)
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

    const description =
      invitation.greetingText?.slice(0, 100) ?? "모바일 청첩장";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: invitation.mainImageUrl ? [invitation.mainImageUrl] : [],
      },
    };
  } catch {
    return {
      title: "청첩장",
    };
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
          {...(["fade", "slide", "zoom"].includes(invitation.animationType ?? "")
            ? { "data-anim": invitation.animationType! }
            : {})}
        >
          <InvitationAnimationOverlay
            animationType={invitation.animationType}
          />

          {invitation.bgmUrl && (
            <InvitationBgmPlayer bgmUrl={invitation.bgmUrl} />
          )}

          <InvitationSectionRenderer invitation={invitation} />

          <div className="pb-16 pb-safe" />
        </div>
      </div>
    </>
  );
}
