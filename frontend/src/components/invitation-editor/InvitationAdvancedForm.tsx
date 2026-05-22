"use client";

import { useEffect, useRef, useState } from "react";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";
import { getBgms } from "@/lib/api/bgm";
import type { BgmResponse } from "@/types/bgm";
import QRCode from "qrcode";

interface InvitationAdvancedFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
  publicUrl: string | null;
}

const ANIMATION_OPTIONS = [
  { key: "", label: "없음" },
  { key: "fade", label: "페이드 인" },
  { key: "slide", label: "슬라이드 업" },
  { key: "zoom", label: "줌 인" },
];

export default function InvitationAdvancedForm({
  data,
  onChange,
  publicUrl,
}: InvitationAdvancedFormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgms, setBgms] = useState<BgmResponse[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  // BGM 목록 조회
  useEffect(() => {
    const fetchBgms = async () => {
      const result = await getBgms();
      setBgms(result);
    };
    fetchBgms();
  }, []);

  // QR 코드 생성
  useEffect(() => {
    if (!publicUrl || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    })
      .then(() => setQrGenerated(true))
      .catch(() => setQrGenerated(false));
  }, [publicUrl]);

  // QR 코드 다운로드
  const handleQrDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-qr.png";
    a.click();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* BGM 선택 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-800">BGM</h3>
          <p className="text-xs text-gray-400">
            청첩장에 사용할 배경 음악을 선택하세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {/* BGM 사용 안 함 */}
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

          {/* BGM 목록 */}
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

        {/* 미리듣기 */}
        {previewUrl && (
          <audio controls src={previewUrl} className="w-full mt-2" />
        )}
      </div>

      {/* 애니메이션 효과 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">애니메이션 효과</h3>
        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange({ animationType: option.key })}
              className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                (data.animationType ?? "") === option.key
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* QR 코드 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">QR 코드</h3>
        {publicUrl ? (
          <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} className="rounded-xl" />
            {qrGenerated && (
              <button
                type="button"
                onClick={handleQrDownload}
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                QR 코드 다운로드
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-xs text-gray-400">
              청첩장을 발행하면 QR 코드가 생성됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
