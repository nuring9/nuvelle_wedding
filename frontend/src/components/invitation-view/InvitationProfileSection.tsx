import type { PublicInvitation } from "@/types/invitation";

interface InvitationProfileSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationProfileSection({
  invitation,
}: InvitationProfileSectionProps) {
  if (!invitation.groomIntroduction && !invitation.brideIntroduction) {
    return null;
  }

  return (
    <section className="section-padding section-alt-bg">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        About Us
      </h2>

      <div className="flex flex-col gap-6">
        {invitation.groomIntroduction && (
          <div className="card-base p-5">
            <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
              신랑 {invitation.groomName}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {invitation.groomIntroduction}
            </p>
          </div>
        )}

        {invitation.brideIntroduction && (
          <div className="card-base p-5">
            <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
              신부 {invitation.brideName}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {invitation.brideIntroduction}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
