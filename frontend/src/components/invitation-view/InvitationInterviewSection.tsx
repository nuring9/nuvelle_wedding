"use client";

import { useEffect, useState } from "react";
import { getInterview } from "@/lib/api/interview";
import type { WeddingInterviewResponse } from "@/types/interview";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationInterviewSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationInterviewSection({
  invitation,
}: InvitationInterviewSectionProps) {
  const [interview, setInterview] = useState<WeddingInterviewResponse | null>(
    null,
  );

  useEffect(() => {
    if (!invitation.interviewEnabled) return;
    const fetch = async () => {
      const data = await getInterview(invitation.id);
      setInterview(data);
    };
    fetch();
  }, [invitation.id, invitation.interviewEnabled]);

  if (!invitation.interviewEnabled || !interview) return null;

  // 질문과 답변을 한쌍으로 묶은 배열
  const qas = [
    { q: interview.question1, a: interview.answer1 },
    { q: interview.question2, a: interview.answer2 },
    { q: interview.question3, a: interview.answer3 },
    { q: interview.question4, a: interview.answer4 },
    { q: interview.question5, a: interview.answer5 },
  ].filter((item) => item.q && item.a);
  // 질문과 답변이 모두 있는 항복만 남김.

  if (qas.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Interview
      </h2>

      <div className="flex flex-col gap-5">
        {qas.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <p className="text-xs font-medium text-primary-500">Q. {item.q}</p>
            <p className="text-sm text-gray-600 leading-relaxed pl-3 border-l-2 border-gray-200">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
