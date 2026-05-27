"use client";

import CopyButton from "@/components/common/CopyButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import InvitationQrPanel from "./InvitationQrPanel";
import type { InvitationResponse } from "@/lib/api/invitations";
import Link from "next/link";
import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

interface InvitationPublishPanelProps {
  invitation: InvitationResponse;
  onPublish: () => Promise<void>;
  onMakePrivate: () => Promise<void>;
  isLoading?: boolean;
}

export default function InvitationPublishPanel({
  invitation,
  onPublish,
  onMakePrivate,
  isLoading = false,
}: InvitationPublishPanelProps) {
  const isPublished = invitation.status === "PUBLISHED";
  const isDraft = invitation.status === "DRAFT";

  // 이 세 변수는 boolean 값을 같는다.

  const statusLabel = {
    DRAFT: "임시저장",
    PRIVATE: "비공개",
    PUBLISHED: "발행됨",
  }[invitation.status];

  const statusColor = {
    DRAFT: "text-gray-500 bg-gray-100",
    PRIVATE: "text-yellow-600 bg-yellow-50",
    PUBLISHED: "text-green-600 bg-green-50",
  }[invitation.status];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? "");
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleKakaoShare = () => {
    if (!invitation.publicUrl || !window.Kakao?.Share) return;

    const title =
      invitation.groomName && invitation.brideName
        ? `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`
        : "청첩장을 전해드립니다";

    const shareImageUrl = invitation.mainImageUrl ?? "";

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: "청첩장 보러가기",
        imageUrl: shareImageUrl,
        link: {
          mobileWebUrl: invitation.publicUrl,
          webUrl: invitation.publicUrl,
        },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: {
            mobileWebUrl: invitation.publicUrl,
            webUrl: invitation.publicUrl,
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-semibold text-gray-800">발행 설정</h3>

      {/* 현재 상태 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">현재 상태</span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* 공개 URL */}
      {isPublished && invitation.publicUrl && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-medium">공개 URL</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-xs text-gray-600 flex-1 truncate">
              {invitation.publicUrl}
            </p>
            <CopyButton text={invitation.publicUrl} label="복사" />
          </div>
        </div>
      )}

      {/* QR 코드 */}
      {isPublished && <InvitationQrPanel publicUrl={invitation.publicUrl} />}

      {/* 발행 버튼 */}
      <div className="flex flex-col gap-2">
        {!isPublished ? (
          <PrimaryButton onClick={onPublish} isLoading={isLoading} fullWidth>
            {isDraft ? "청첩장 발행하기" : "다시 발행하기"}
          </PrimaryButton>
        ) : (
          <SecondaryButton
            onClick={onMakePrivate}
            isLoading={isLoading}
            fullWidth
          >
            비공개로 전환
          </SecondaryButton>
        )}
      </div>

      {/* 카카오 공유 */}
      {isPublished && invitation.publicUrl && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-medium">공유하기</p>
          <button
            type="button"
            onClick={handleKakaoShare}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 transition-colors text-sm font-medium text-yellow-900 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.667 1.581 5.01 4 6.438V21l3.438-2.063A11.1 11.1 0 0012 19c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
            </svg>
            카카오톡으로 공유
          </button>
        </div>
      )}

      {/* RSVP 결과 확인 */}
      {isPublished && invitation.rsvpEnabled && (
        <div className="mb-8 pt-6 border-t border-gray-100">
          <Link
            href={`/invitations/${invitation.id}/rsvps`}
            className="flex items-center justify-between text-sm text-primary-500 hover:text-primary-600 transition-colors"
          >
            <span>참석 여부 결과 확인</span>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}

      {!isPublished && (
        <p className="text-xs text-gray-400 text-center">
          발행하면 공개 URL이 생성되어 하객과 공유할 수 있습니다.
        </p>
      )}
    </div>
  );
}
