"use client";

import { useEffect, useRef, useState } from "react";
import * as QRCode from "qrcode";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationQrSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationQrSection({
  invitation,
}: InvitationQrSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invitation.slug}`;

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 90,
      margin: 2,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    })
      .then(() => setGenerated(true))
      .catch(() => setGenerated(false));
  }, [publicUrl]);

  return (
    <section className="section-padding text-center" style={{ paddingBottom: "4rem" }}>
      <h2 className="text-xs tracking-widest text-gray-400 mb-5 uppercase">
        QR Code
      </h2>

      <p className="text-xs text-gray-400 mb-6">
        QR 코드를 스캔하면
        <br /> 이 청첩장을 바로 볼 수 있습니다.
      </p>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className={generated ? "rounded-lg shadow-sm" : "hidden"}
        />
      </div>
    </section>
  );
}
