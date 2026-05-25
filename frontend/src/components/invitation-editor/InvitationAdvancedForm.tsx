"use client";

import { useEffect, useState } from "react";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";
import { getBgms } from "@/lib/api/bgm";
import type { BgmResponse } from "@/types/bgm";

interface InvitationAdvancedFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationAdvancedForm({
  data,
  onChange,
}: InvitationAdvancedFormProps) {
  const [bgms, setBgms] = useState<BgmResponse[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBgms = async () => {
      const result = await getBgms();
      setBgms(result);
    };

    fetchBgms();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-800">BGM</h3>
        <p className="text-xs text-gray-400">
          청첩장에 사용할 배경 음악을 선택하세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            onChange({ bgmId: null });
            setPreviewUrl(null);
          }}
          className={`rounded-xl border-2 p-4 text-left text-sm transition-all ${
            data.bgmId == null
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          BGM 사용 안 함
        </button>

        {bgms.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            등록된 BGM이 없습니다.
          </p>
        )}

        {bgms.map((bgm) => (
          <div
            key={bgm.id}
            className={`rounded-xl border-2 p-4 transition-all ${
              data.bgmId === bgm.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <button
              type="button"
              onClick={() => onChange({ bgmId: bgm.id })}
              className="w-full text-left"
            >
              <p className="text-sm font-medium text-gray-800">{bgm.title}</p>
              {bgm.mood && (
                <p className="mt-0.5 text-xs text-gray-400">{bgm.mood}</p>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setPreviewUrl((prev) =>
                  prev === bgm.fileUrl ? null : bgm.fileUrl,
                )
              }
              className="mt-2 text-xs text-primary-500 hover:text-primary-600 transition-colors"
            >
              {previewUrl === bgm.fileUrl ? "미리듣기 닫기" : "미리듣기"}
            </button>
          </div>
        ))}
      </div>

      {previewUrl && (
        <audio controls src={previewUrl} className="w-full mt-2" />
      )}
    </div>
  );
}
