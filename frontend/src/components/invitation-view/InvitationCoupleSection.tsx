import type { PublicInvitation } from "@/types/invitation";

interface InvitationCoupleSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationCoupleSection({
  invitation,
}: InvitationCoupleSectionProps) {
  if (!invitation.parentsEnabled) return null;

  return (
    <section className="section-padding text-center">
      <div className="flex justify-center items-center gap-12">
        {/* 신랑 측 */}
        <div className="flex flex-col items-center gap-1">
          {invitation.groomFatherName && (
            <p className="text-xs text-gray-400">
              {invitation.groomFatherName} · {invitation.groomMotherName}의 아들
            </p>
          )}
          <p className="text-lg font-medium text-gray-800">
            {invitation.groomName}
          </p>
        </div>

        <span className="text-primary-400 text-xl">♥</span>

        {/* 신부 측 */}
        <div className="flex flex-col items-center gap-1">
          {invitation.brideFatherName && (
            <p className="text-xs text-gray-400">
              {invitation.brideFatherName} · {invitation.brideMotherName}의 딸
            </p>
          )}
          <p className="text-lg font-medium text-gray-800">
            {invitation.brideName}
          </p>
        </div>
      </div>
    </section>
  );
}
