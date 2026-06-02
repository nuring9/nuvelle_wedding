import type { PublicInvitation } from "@/types/invitation";

interface InvitationCoupleSectionProps {
  invitation: PublicInvitation;
}

function PhoneIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.143-7.143 1.125 1.125 0 01.38-1.21l1.293-.97c.36-.27.527-.731.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function ContactLink({
  phone,
  label,
  show,
}: {
  phone: string | null;
  label: string;
  show: boolean;
}) {
  if (!show || !phone) return null;

  return (
    <a
      href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
      aria-label={`${label}에게 전화하기`}
      className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary-100 bg-white/80 text-primary-500 shadow-sm transition-colors hover:bg-primary-50"
    >
      <PhoneIcon />
    </a>
  );
}

export default function InvitationCoupleSection({
  invitation,
}: InvitationCoupleSectionProps) {
  if (!invitation.groomName && !invitation.brideName) return null;

  const showContact = invitation.contactEnabled;

  return (
    <section className="section-padding text-center">
      <div className="flex justify-center items-center gap-5">
        {/* 신랑 측 */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          {invitation.parentsEnabled && (invitation.groomFatherName || invitation.groomMotherName) && (
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {[invitation.groomFatherName, invitation.groomMotherName].filter(Boolean).join(" · ")}의 아들
            </p>
          )}
          <p className="text-xl font-medium text-gray-800 tracking-wide">
            {invitation.groomName}
          </p>
          <ContactLink
            phone={invitation.groomPhone}
            label="신랑"
            show={showContact}
          />
        </div>

        <span
          className="select-none"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "2rem",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--invite-primary)",
            opacity: 0.3,
            lineHeight: 1,
          }}
        >
          &amp;
        </span>

        {/* 신부 측 */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          {invitation.parentsEnabled && (invitation.brideFatherName || invitation.brideMotherName) && (
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {[invitation.brideFatherName, invitation.brideMotherName].filter(Boolean).join(" · ")}의 딸
            </p>
          )}
          <p className="text-xl font-medium text-gray-800 tracking-wide">
            {invitation.brideName}
          </p>
          <ContactLink
            phone={invitation.bridePhone}
            label="신부"
            show={showContact}
          />
        </div>
      </div>
    </section>
  );
}
