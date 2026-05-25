"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface InvitationQrPanelProps {
  publicUrl: string | null;
}

export default function InvitationQrPanel({
  publicUrl,
}: InvitationQrPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (!publicUrl || !canvasRef.current) {
      setQrGenerated(false);
      return;
    }

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 80,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    })
      .then(() => setQrGenerated(true))
      .catch(() => setQrGenerated(false));
  }, [publicUrl]);

  const handleQrDownload = () => {
    if (!canvasRef.current) return;

    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-qr.png";
    a.click();
  };

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-500 font-medium">QR 코드</p>

      {publicUrl ? (
        <div className="flex w-fit flex-col items-center gap-3 self-center rounded-xl bg-gray-50 p-3">
          <canvas ref={canvasRef} className="rounded-lg bg-white" />

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
        <div className="rounded-xl bg-gray-50 p-6 text-center">
          <p className="text-xs text-gray-400">
            청첩장을 발행하면 QR 코드를 생성할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
