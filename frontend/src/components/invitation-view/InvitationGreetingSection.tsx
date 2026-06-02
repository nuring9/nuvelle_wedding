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
      <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-3">
        Greeting
      </h2>

      <p className="text-sm text-gray-600 leading-loose whitespace-pre-line">
        {invitation.greetingText}
      </p>
    </section>
  );
}
