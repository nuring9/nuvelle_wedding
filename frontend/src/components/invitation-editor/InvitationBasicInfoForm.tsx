"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import ImageUploader from "../common/ImageUploader";

interface InvitationBasicInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

const MAIN_OVERLAY_TEXT_OPTIONS = [
  "Forever Begins",
  "With Love",
  "Together Forever",
  "Our Wedding Day",
  "Marry Me",
];

export default function InvitationBasicInfoForm({
  data,
  onChange,
}: InvitationBasicInfoFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">메인 사진</h3>
        <div className="max-w-[200px] mx-auto">
          <ImageUploader
            value={data.mainImageUrl ?? null}
            onChange={(url) => onChange({ mainImageUrl: url })}
            onDelete={() => onChange({ mainImageUrl: "" })}
            directory="invitations/main"
            aspect="portrait"
            placeholder="메인 사진 업로드"
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          JPG, PNG 권장 · 최대 10MB
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">메인 문구</h3>
          <p className="mt-1 text-xs text-gray-400">
            선택한 문구가 메인 사진 위에 필기체로 표시됩니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ mainOverlayText: "" })}
            className={`rounded-xl border-2 p-3 text-left text-sm font-medium transition-all ${
              !data.mainOverlayText
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            선택 안 함
          </button>

          {MAIN_OVERLAY_TEXT_OPTIONS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => onChange({ mainOverlayText: text })}
              className={`rounded-xl border-2 p-3 text-left text-lg transition-all main-overlay-option ${
                data.mainOverlayText === text
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
