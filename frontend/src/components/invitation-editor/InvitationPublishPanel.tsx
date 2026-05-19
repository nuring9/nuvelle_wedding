"use client";

import CopyButton from "@/components/common/CopyButton";
import PrimaryButton from "@/components/common/PrimaryButton";
import SecondaryButton from "@/components/common/SecondaryButton";
import type { InvitationResponse } from "@/lib/api/invitations";

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
  const isPrivate = invitation.status === "PRIVATE";
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

      {/* 발행 버튼 */}
      <div className="flex flex-col gap-2">
        {!isPublished && (
          <PrimaryButton onClick={onPublish} isLoading={isLoading} fullWidth>
            {isDraft ? "청첩장 발행하기" : "다시 발행하기"}
          </PrimaryButton>
        )}

        {isPublished && (
          <SecondaryButton
            onClick={onMakePrivate}
            isLoading={isLoading}
            fullWidth
          >
            비공개로 전환
          </SecondaryButton>
        )}
      </div>

      {!isPublished && (
        <p className="text-xs text-gray-400 text-center">
          발행하면 공개 URL이 생성되어 하객과 공유할 수 있습니다.
        </p>
      )}
    </div>
  );
}
