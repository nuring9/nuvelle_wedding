"use client";

import type { PublicInvitation } from "@/types/invitation";
import dayjs from "dayjs";

interface InvitationDdaySectionProps {
  invitation: PublicInvitation;
}

export default function InvitationDdaySection({
  invitation,
}: InvitationDdaySectionProps) {
  if (!invitation.ddayEnabled || !invitation.weddingDate) return null;

  const today = dayjs().startOf("day");
  const wedding = dayjs(invitation.weddingDate).startOf("day");
  const dday = wedding.diff(today, "day");

  const ddayText =
    dday === 0 ? "D-Day" : dday > 0 ? `D-${dday}` : `D+${Math.abs(dday)}`;

  return (
    <section className="section-padding text-center">
      <p className="text-xs tracking-widest text-gray-400 mb-4 uppercase">
        D-Day
      </p>
      <p className="text-5xl font-display font-semibold text-primary-500">
        {ddayText}
      </p>
      {dday > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          결혼식까지 {dday}일 남았습니다
        </p>
      )}
      {dday === 0 && (
        <p className="text-xs text-gray-400 mt-3">오늘이 결혼식 날입니다 🎉</p>
      )}
      {dday < 0 && (
        <p className="text-xs text-gray-400 mt-3">
          결혼식으로부터 {Math.abs(dday)}일이 지났습니다
        </p>
      )}
    </section>
  );
}
