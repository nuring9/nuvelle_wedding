"use client";

import type {
  GalleryImageResponse,
  InvitationResponse,
  UpdateInvitationRequest,
} from "@/lib/api/invitations";
import type { PublicInvitation } from "@/types/invitation";
import InvitationAnimationOverlay from "@/components/invitation-view/InvitationAnimationOverlay";
import InvitationSectionRenderer from "@/components/invitation-view/InvitationSectionRenderer";
import type { InvitationSectionId } from "@/constants/invitationSections";

interface InvitationLivePreviewProps {
  invitation: InvitationResponse;
  formData: UpdateInvitationRequest;
  galleries: GalleryImageResponse[];
  isMainImagePositionMode?: boolean;
  onMainImagePositionChange?: (position: string) => void;
  isPhotoBannerPositionMode?: boolean;
  onPhotoBannerPositionChange?: (position: string) => void;
  onSectionOrderChange?: (sectionOrder: InvitationSectionId[]) => void;
  interviewVersion?: number;
}

function toPreviewInvitation(
  invitation: InvitationResponse,
  formData: UpdateInvitationRequest,
  galleries: GalleryImageResponse[],
): PublicInvitation {
  return {
    id: invitation.id,
    slug: invitation.slug,
    templateId: String(invitation.templateId),
    themeKey: invitation.theme ?? null,
    mainImageUrl: formData.mainImageUrl ?? null,
    mainOverlayText: formData.mainOverlayText ?? null,
    mainImagePosition: formData.mainImagePosition ?? "50% 50%",
    groomName: formData.groomName ?? null,
    brideName: formData.brideName ?? null,
    groomPhone: formData.groomPhone ?? null,
    bridePhone: formData.bridePhone ?? null,
    contactEnabled: formData.contactEnabled ?? false,
    groomIntroduction: formData.groomIntroduction ?? null,
    brideIntroduction: formData.brideIntroduction ?? null,
    groomFatherName: formData.groomFatherName ?? null,
    groomMotherName: formData.groomMotherName ?? null,
    brideFatherName: formData.brideFatherName ?? null,
    brideMotherName: formData.brideMotherName ?? null,
    greetingText: formData.greetingText ?? null,
    weddingDate: formData.weddingDate ?? null,
    weddingTime: formData.weddingTime ?? null,
    venueName: formData.venueName ?? null,
    venueAddress: formData.venueAddress ?? null,
    venueDetail: formData.venueDetail ?? null,
    transportInfo: formData.transportInfo ?? null,
    mapLat: formData.mapLat ?? null,
    mapLng: formData.mapLng ?? null,
    accountBank: formData.accountBank ?? null,
    accountNumber: formData.accountNumber ?? null,
    accountHolder: formData.accountHolder ?? null,
    accounts: formData.accounts ?? [],
    galleryEnabled: formData.galleryEnabled ?? false,
    rsvpEnabled: formData.rsvpEnabled ?? false,
    guestbookEnabled: formData.guestbookEnabled ?? false,
    accountEnabled: formData.accountEnabled ?? false,
    parentsEnabled: formData.parentsEnabled ?? false,
    ddayEnabled: formData.ddayEnabled ?? false,
    theme: formData.theme ?? null,
    fontFamily: formData.fontFamily ?? null,
    galleryLayout: formData.galleryLayout ?? null,
    animationType: formData.animationType ?? null,
    bgmId: formData.bgmId ?? null,
    bgmUrl: invitation.bgmUrl,
    bgmTitle: invitation.bgmTitle,
    remittanceLink: formData.remittanceLink ?? null,
    interviewEnabled: formData.interviewEnabled ?? false,
    guestPhotoEnabled: formData.guestPhotoEnabled ?? false,
    photoBannerEnabled: formData.photoBannerEnabled ?? false,
    photoBannerUrl: formData.photoBannerUrl ?? null,
    photoBannerPosition: formData.photoBannerPosition ?? "50% 50%",
    calendarEnabled: formData.calendarEnabled ?? true,
    qrEnabled: formData.qrEnabled ?? true,
    galleries,
    sectionOrder: formData.sectionOrder ?? invitation.sectionOrder ?? [],
  };
}

export default function InvitationLivePreview({
  invitation,
  formData,
  galleries,
  isMainImagePositionMode = false,
  onMainImagePositionChange,
  isPhotoBannerPositionMode = false,
  onPhotoBannerPositionChange,
  onSectionOrderChange,
  interviewVersion = 0,
}: InvitationLivePreviewProps) {
  const previewInvitation = toPreviewInvitation(
    invitation,
    formData,
    galleries,
  );
  const theme = previewInvitation.theme || "classic";
  const font = previewInvitation.fontFamily || "noto-sans";

  return (
    <aside className="hidden xl:flex h-full w-[420px] shrink-0 items-center justify-center border-l border-gray-100 bg-gray-50 px-8 py-6">
      <div className="editor-phone-frame">
        <div className="editor-phone-speaker" />
        <InvitationAnimationOverlay
          animationType={previewInvitation.animationType}
          contained
        />
        <div
          className="editor-phone-screen invitation-themed"
          data-invitation-theme={theme}
          data-invitation-font={font}
        >
          <InvitationSectionRenderer
            invitation={previewInvitation}
            editable
            disableSectionDrag={isMainImagePositionMode || isPhotoBannerPositionMode}
            mainImagePositionEditable={isMainImagePositionMode}
            onMainImagePositionChange={onMainImagePositionChange}
            photoBannerPositionEditable={isPhotoBannerPositionMode}
            onPhotoBannerPositionChange={onPhotoBannerPositionChange}
            onOrderChange={onSectionOrderChange}
            interviewVersion={interviewVersion}
          />
        </div>
      </div>
    </aside>
  );
}
