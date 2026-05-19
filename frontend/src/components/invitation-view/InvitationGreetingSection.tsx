import type { PublicInvitation } from "@/types/invitation";

interface InvitationGreetingSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationGreetingSection({
  invitation,
}: InvitationGreetingSectionProps) {
  if (!invitation.greetingText) return null;

  return (
    <section className="section-padding text-center">
      <div className="w-8 h-px bg-gray-200 mx-auto mb-8" />
      <p className="text-sm text-gray-600 leading-loose whitespace-pre-line font-serif">
        {invitation.greetingText}
      </p>
      <div className="w-8 h-px bg-gray-200 mx-auto mt-8" />
    </section>
  );
}
