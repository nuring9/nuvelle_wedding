import type { PublicInvitation } from "@/types/invitation";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

interface InvitationWeddingInfoSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationWeddingInfoSection({
  invitation,
}: InvitationWeddingInfoSectionProps) {
  if (!invitation.weddingDate && !invitation.venueName) return null;

  const formattedDate = invitation.weddingDate
    ? dayjs(invitation.weddingDate).format("YYYY년 MM월 DD일 dddd")
    : null;

  const formattedTime = invitation.weddingTime
    ? dayjs(`2000-01-01 ${invitation.weddingTime}`).format("A h시 mm분")
    : null;

  return (
    <section className="section-padding text-center bg-gray-50">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase">
        Wedding Day
      </h2>

      {formattedDate && (
        <p className="text-xl font-serif text-gray-800 mb-2">{formattedDate}</p>
      )}

      {formattedTime && (
        <p className="text-base text-gray-600 mb-6">{formattedTime}</p>
      )}

      {invitation.venueName && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-gray-800">
            {invitation.venueName}
          </p>
          {invitation.venueAddress && (
            <p className="text-xs text-gray-400">{invitation.venueAddress}</p>
          )}
          {invitation.venueDetail && (
            <p className="text-xs text-gray-400">{invitation.venueDetail}</p>
          )}
        </div>
      )}
    </section>
  );
}
