import type { PublicInvitation } from "@/types/invitation";

interface InvitationRemittanceSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationRemittanceSection({
  invitation,
}: InvitationRemittanceSectionProps) {
  if (!invitation.remittanceLink) return null;
  // 송금 링크가 없으면 아예 아무것도 렌더링하지 않음.

  return (
    <section className="section-padding">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        마음 전하실 곳
      </h2>

      <div className="card-base p-5 text-center">
        <p className="text-sm text-gray-600 mb-4">
          축의금은 아래 링크로 보내주세요.
        </p>
        <a
          href={invitation.remittanceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-primary text-sm px-6 py-3"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          송금하기
        </a>
      </div>
    </section>
  );
}
