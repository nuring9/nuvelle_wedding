"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import ImageUploader from "../common/ImageUploader";

interface Props {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
  isPositionMode: boolean;
  onPositionModeChange: (enabled: boolean) => void;
}

export default function InvitationPhotoBannerForm({ data, onChange, isPositionMode, onPositionModeChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">포토 배너</h3>
      <p className="text-xs text-gray-400">
        원하는 위치에 사진을 배너처럼 넣을 수 있어요. 섹션 순서를 드래그해서 위치를 조정하세요.
      </p>
      <ImageUploader
        value={data.photoBannerUrl ?? null}
        onChange={(url) => {
          onPositionModeChange(false);
          onChange({ photoBannerUrl: url, photoBannerPosition: "50% 50%" });
        }}
        onDelete={() => {
          onPositionModeChange(false);
          onChange({ photoBannerUrl: "", photoBannerPosition: "50% 50%" });
        }}
        directory="invitations/banner"
        aspect="landscape"
        placeholder="배너 사진 업로드"
      />
      {data.photoBannerUrl && (
        <button
          type="button"
          onClick={() => onPositionModeChange(!isPositionMode)}
          className={`w-full rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isPositionMode
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isPositionMode ? "위치 조정 완료" : "이미지 위치 조정"}
        </button>
      )}
    </div>
  );
}
