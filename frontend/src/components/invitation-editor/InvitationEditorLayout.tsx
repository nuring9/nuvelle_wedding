"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import InvitationSaveBar from "./InvitationSaveBar";
import InvitationBasicInfoForm from "./InvitationBasicInfoForm";
import InvitationCoupleInfoForm from "./InvitationCoupleInfoForm";
import InvitationParentsInfoForm from "./InvitationParentsInfoForm";
import InvitationGreetingForm from "./InvitationGreetingForm";
import InvitationWeddingInfoForm from "./InvitationWeddingInfoForm";
import InvitationGalleryForm from "./InvitationGalleryForm";
import InvitationAccountForm from "./InvitationAccountForm";
import InvitationSectionToggleForm from "./InvitationSectionToggleForm";
import InvitationPublishPanel from "./InvitationPublishPanel";
import InvitationThemeForm from "./InvitationThemeForm";
import InvitationProfileForm from "./InvitationProfileForm";
import InvitationInterviewForm from "./InvitationInterviewForm";
import InvitationAdvancedForm from "./InvitationAdvancedForm";
import InvitationAnimationForm from "./InvitationAnimationForm";
import InvitationLivePreview from "./InvitationLivePreview";
import {
  updateInvitation,
  publishInvitation,
  makePrivateInvitation,
  type InvitationResponse,
  type UpdateInvitationRequest,
  type GalleryImageResponse,
} from "@/lib/api/invitations";
import { THEME_OPTIONS } from "@/constants/invitation";

interface InvitationEditorLayoutProps {
  invitation: InvitationResponse;
}

type TabKey =
  | "basic"
  | "couple"
  | "parents"
  | "greeting"
  | "wedding"
  | "gallery"
  | "account"
  | "theme"
  | "profile"
  | "interview"
  | "advanced"
  | "animation"
  | "section"
  | "publish";

const TABS: { key: TabKey; label: string }[] = [
  { key: "basic", label: "메인 사진" },
  { key: "couple", label: "신랑·신부" },
  { key: "parents", label: "부모님" },
  { key: "profile", label: "소개" },
  { key: "greeting", label: "인사말" },
  { key: "wedding", label: "예식 정보" },
  { key: "gallery", label: "갤러리" },
  { key: "account", label: "계좌번호" },
  { key: "interview", label: "웨딩 인터뷰" },
  { key: "theme", label: "테마/폰트" },
  { key: "advanced", label: "BGM" },
  { key: "animation", label: "애니메이션" },
  { key: "section", label: "섹션 설정" },
  { key: "publish", label: "발행" },
];

function toFormData(invitation: InvitationResponse): UpdateInvitationRequest {
  return {
    title: invitation.title ?? "",
    mainImageUrl: invitation.mainImageUrl ?? "",
    mainOverlayText: invitation.mainOverlayText ?? "",
    groomName: invitation.groomName ?? "",
    brideName: invitation.brideName ?? "",
    groomFatherName: invitation.groomFatherName ?? "",
    groomMotherName: invitation.groomMotherName ?? "",
    brideFatherName: invitation.brideFatherName ?? "",
    brideMotherName: invitation.brideMotherName ?? "",
    greetingText: invitation.greetingText ?? "",
    weddingDate: invitation.weddingDate ?? "",
    weddingTime: invitation.weddingTime ?? "",
    venueName: invitation.venueName ?? "",
    venueAddress: invitation.venueAddress ?? "",
    venueDetail: invitation.venueDetail ?? "",
    transportInfo: invitation.transportInfo ?? "",
    mapLat: invitation.mapLat ?? undefined,
    mapLng: invitation.mapLng ?? undefined,
    accountBank: invitation.accountBank ?? "",
    accountNumber: invitation.accountNumber ?? "",
    accountHolder: invitation.accountHolder ?? "",
    accounts: invitation.accounts ?? [],
    galleryEnabled: invitation.galleryEnabled,
    rsvpEnabled: invitation.rsvpEnabled,
    guestbookEnabled: invitation.guestbookEnabled,
    accountEnabled: invitation.accountEnabled,
    parentsEnabled: invitation.parentsEnabled,
    ddayEnabled: invitation.ddayEnabled,
    theme: invitation.theme ?? "",
    fontFamily: invitation.fontFamily ?? "",
    galleryLayout: invitation.galleryLayout ?? "",
    animationType: invitation.animationType ?? "",
    bgmId: invitation.bgmId ?? null,
    groomIntroduction: invitation.groomIntroduction ?? "",
    brideIntroduction: invitation.brideIntroduction ?? "",
    remittanceLink: invitation.remittanceLink ?? "",
    interviewEnabled: invitation.interviewEnabled ?? false,
    guestPhotoEnabled: invitation.guestPhotoEnabled ?? false,
  };
}

export default function InvitationEditorLayout({
  invitation: initialInvitation,
}: InvitationEditorLayoutProps) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [invitation, setInvitation] =
    useState<InvitationResponse>(initialInvitation);
  const [formData, setFormData] = useState<UpdateInvitationRequest>(
    toFormData(initialInvitation),
  );
  const [galleries, setGalleries] = useState<GalleryImageResponse[]>(
    initialInvitation.galleries,
  );
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentThemeLabel =
    THEME_OPTIONS.find((theme) => theme.key === formData.theme)?.label ??
    invitation.templateName;

  const handleSave = useCallback(async () => {
    if (!accessToken) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateInvitation(
        invitation.id,
        formData,
        accessToken,
      );
      setInvitation(updated);
      setLastSaved(new Date());
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [accessToken, invitation.id, formData]);

  const handleChange = useCallback(
    (data: Partial<UpdateInvitationRequest>) => {
      setFormData((prev) => ({ ...prev, ...data }));

      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        handleSave();
      }, 2000);
    },
    [handleSave],
  );

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  const handlePublish = async () => {
    if (!accessToken) return;
    setIsPublishLoading(true);
    try {
      await handleSave();
      const updated = await publishInvitation(invitation.id, accessToken);
      setInvitation(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsPublishLoading(false);
    }
  };

  const handleMakePrivate = async () => {
    if (!accessToken) return;
    setIsPublishLoading(true);
    try {
      const updated = await makePrivateInvitation(invitation.id, accessToken);
      setInvitation(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsPublishLoading(false);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case "basic":
        return (
          <InvitationBasicInfoForm data={formData} onChange={handleChange} />
        );
      case "couple":
        return (
          <InvitationCoupleInfoForm data={formData} onChange={handleChange} />
        );
      case "parents":
        return (
          <InvitationParentsInfoForm data={formData} onChange={handleChange} />
        );
      case "greeting":
        return (
          <InvitationGreetingForm data={formData} onChange={handleChange} />
        );
      case "wedding":
        return (
          <InvitationWeddingInfoForm data={formData} onChange={handleChange} />
        );
      case "gallery":
        return (
          <InvitationGalleryForm
            invitationId={invitation.id}
            galleries={galleries}
            onGalleriesChange={setGalleries}
          />
        );
      case "account":
        return (
          <InvitationAccountForm data={formData} onChange={handleChange} />
        );
      case "animation":
        return (
          <InvitationAnimationForm data={formData} onChange={handleChange} />
        );
      case "section":
        return (
          <InvitationSectionToggleForm
            data={formData}
            onChange={handleChange}
          />
        );
      case "theme":
        return <InvitationThemeForm data={formData} onChange={handleChange} />;
      case "publish":
        return (
          <InvitationPublishPanel
            invitation={invitation}
            onPublish={handlePublish}
            onMakePrivate={handleMakePrivate}
            isLoading={isPublishLoading}
          />
        );
      case "profile":
        return (
          <InvitationProfileForm data={formData} onChange={handleChange} />
        );
      case "interview":
        return <InvitationInterviewForm invitationId={invitation.id} />;
      case "advanced":
        return (
          <InvitationAdvancedForm data={formData} onChange={handleChange} />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 border-b border-gray-100 bg-white">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => router.push("/invitations")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            내 청첩장
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xs text-gray-400">{currentThemeLabel}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              invitation.status === "PUBLISHED"
                ? "bg-green-50 text-green-600"
                : invitation.status === "PRIVATE"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {invitation.status === "PUBLISHED"
              ? "발행됨"
              : invitation.status === "PRIVATE"
                ? "비공개"
                : "임시저장"}
          </span>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden sm:block">
            <InvitationSaveBar isSaving={isSaving} lastSaved={lastSaved} />
          </div>

          <button
            type="button"
            onClick={() => window.open(`/invite/${invitation.slug}`, "_blank")}
            className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            미리보기
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="overflow-x-auto border-b border-gray-100 bg-white">
        <div className="flex w-max mx-auto px-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 폼 + 실시간 미리보기 영역 */}
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-4 py-6">
            {renderForm()}

            {activeTab !== "publish" && activeTab !== "interview" && (
              <div className="pt-10 pb-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-40 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "저장 중..." : "저장하기"}
                </button>
              </div>
            )}
          </div>
        </div>

        <InvitationLivePreview
          invitation={invitation}
          formData={formData}
          galleries={galleries}
        />
      </div>
    </div>
  );
}
