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
import InvitationMapForm from "./InvitationMapForm";
import InvitationGalleryForm from "./InvitationGalleryForm";
import InvitationAccountForm from "./InvitationAccountForm";
import InvitationSectionToggleForm from "./InvitationSectionToggleForm";
import InvitationPublishPanel from "./InvitationPublishPanel";
import {
  updateInvitation,
  publishInvitation,
  makePrivateInvitation,
  addGalleryImage,
  deleteGalleryImage,
  type InvitationResponse,
  type UpdateInvitationRequest,
} from "@/lib/api/invitations";

interface InvitationEditorLayoutProps {
  invitation: InvitationResponse;
}

type TabKey =
  | "basic"
  | "couple"
  | "parents"
  | "greeting"
  | "wedding"
  | "map"
  | "gallery"
  | "account"
  | "section"
  | "publish";

const TABS: { key: TabKey; label: string }[] = [
  { key: "basic", label: "메인 사진" },
  { key: "couple", label: "신랑·신부" },
  { key: "parents", label: "부모님" },
  { key: "greeting", label: "인사말" },
  { key: "wedding", label: "예식 정보" },
  { key: "map", label: "지도" },
  { key: "gallery", label: "갤러리" },
  { key: "account", label: "계좌번호" },
  { key: "section", label: "섹션 설정" },
  { key: "publish", label: "발행" },
];

function toFormData(invitation: InvitationResponse): UpdateInvitationRequest {
  return {
    title: invitation.title ?? "",
    mainImageUrl: invitation.mainImageUrl ?? "",
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
    bgmUrl: invitation.bgmUrl ?? "",
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
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 자동저장 타이머
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // 서버에서 받아온 청첩장 데이터를 수정 폼에서 사용.
  const handleSave = useCallback(async () => {
    if (!accessToken) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }

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

  //  일부 필드만 들어올 수 있기 때문에 타입 Partial
  const handleChange = useCallback((data: Partial<UpdateInvitationRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // 자동저장: 입력 후 2초 뒤 저장
  // 자동저장: 입력 후 2초 뒤 저장
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!accessToken) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
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
        autoSaveTimer.current = null;
      }
    }, 2000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = null;
      }
    };
  }, [formData, accessToken, invitation.id]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  // 이미지 업로드 (메인 사진)
  const handleMainImageUpload = async (file: File, field: "mainImageUrl") => {
    if (!accessToken) return;
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("directory", "invitations/main");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formDataUpload,
        },
      );
      const json = await res.json();
      if (json.success && json.data?.url) {
        handleChange({ [field]: json.data.url });
      }
    } catch {
      setError("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 갤러리 이미지 업로드
  const handleGalleryUpload = async (file: File) => {
    if (!accessToken) return;
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("directory", "invitations/gallery");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formDataUpload,
        },
      );
      const json = await res.json();
      if (json.success && json.data?.url) {
        const gallery = await addGalleryImage(
          invitation.id,
          json.data.url,
          accessToken,
        );
        setInvitation((prev) => ({
          ...prev,
          galleries: [...prev.galleries, gallery],
        }));
      }
    } catch {
      setError("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 갤러리 이미지 삭제
  const handleGalleryDelete = async (imageId: number) => {
    if (!accessToken) return;
    try {
      await deleteGalleryImage(invitation.id, imageId, accessToken);
      setInvitation((prev) => ({
        ...prev,
        galleries: prev.galleries.filter((g) => g.id !== imageId),
      }));
    } catch {
      setError("이미지 삭제에 실패했습니다.");
    }
  };

  // 발행
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

  // 비공개
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
          <InvitationBasicInfoForm
            data={formData}
            onChange={handleChange}
            onImageUpload={handleMainImageUpload}
            isUploading={isUploading}
          />
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
      case "map":
        return <InvitationMapForm data={formData} onChange={handleChange} />;
      case "gallery":
        return (
          <InvitationGalleryForm
            galleries={invitation.galleries}
            onUpload={handleGalleryUpload}
            onDelete={handleGalleryDelete}
            isUploading={isUploading}
          />
        );
      case "account":
        return (
          <InvitationAccountForm data={formData} onChange={handleChange} />
        );
      case "section":
        return (
          <InvitationSectionToggleForm
            data={formData}
            onChange={handleChange}
          />
        );
      case "publish":
        return (
          <InvitationPublishPanel
            invitation={invitation}
            onPublish={handlePublish}
            onMakePrivate={handleMakePrivate}
            isLoading={isPublishLoading}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <button
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

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400">
            {invitation.templateName}
          </span>
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

        <button
          onClick={() => window.open(`/invite/${invitation.slug}`, "_blank")}
          className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
        >
          미리보기
        </button>
      </div>

      {/* 저장 상태바 */}
      <InvitationSaveBar isSaving={isSaving} lastSaved={lastSaved} />

      {/* 에러 메시지 */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="overflow-x-auto border-b border-gray-100 bg-white">
        <div className="flex min-w-max px-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
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

      {/* 폼 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          {renderForm()}

          {activeTab !== "publish" && (
            <div className="pt-10 pb-8 flex justify-center">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="min-w-40 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
