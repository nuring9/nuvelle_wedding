"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import ImageUploader from "../common/ImageUploader";

interface InvitationBasicInfoFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

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
    </div>
  );
}
