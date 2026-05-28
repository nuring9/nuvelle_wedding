"use client";

import { useEffect, useState } from "react";
import { getInterview } from "@/lib/api/interview";
import type { WeddingInterviewResponse } from "@/types/interview";
import type { PublicInvitation } from "@/types/invitation";

interface InvitationInterviewSectionProps {
  invitation: PublicInvitation;
}

interface InterviewItem {
  question: string;
  answer: string;
}

export default function InvitationInterviewSection({
  invitation,
}: InvitationInterviewSectionProps) {
  const [interview, setInterview] = useState<WeddingInterviewResponse | null>(
    null,
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!invitation.interviewEnabled) return;

    const fetchInterview = async () => {
      const data = await getInterview(invitation.id);
      setInterview(data);
    };

    fetchInterview();
  }, [invitation.id, invitation.interviewEnabled]);

  if (!invitation.interviewEnabled || !interview) return null;

  const items: InterviewItem[] = [
    { question: interview.question1 ?? "", answer: interview.answer1 ?? "" },
    { question: interview.question2 ?? "", answer: interview.answer2 ?? "" },
    { question: interview.question3 ?? "", answer: interview.answer3 ?? "" },
    { question: interview.question4 ?? "", answer: interview.answer4 ?? "" },
    { question: interview.question5 ?? "", answer: interview.answer5 ?? "" },
    { question: interview.question6 ?? "", answer: interview.answer6 ?? "" },
    { question: interview.question7 ?? "", answer: interview.answer7 ?? "" },
    { question: interview.question8 ?? "", answer: interview.answer8 ?? "" },
    { question: interview.question9 ?? "", answer: interview.answer9 ?? "" },
    {
      question: interview.question10 ?? "",
      answer: interview.answer10 ?? "",
    },
  ].filter(
    (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
  );

  if (items.length === 0) return null;

  return (
    <section className="section-padding section-alt-bg">
      <h2 className="text-xs tracking-widest text-gray-400 mb-3 uppercase text-center">
        Interview
      </h2>

      <p className="mb-8 text-center text-sm leading-relaxed text-gray-500">
        서로에게 전하는 작은 이야기
      </p>

      <div className="card-base divide-y divide-gray-100 overflow-hidden">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={`${item.question}-${index}`}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-xs font-semibold text-primary-500">
                    Q{index + 1}
                  </span>
                  <span className="text-xs font-medium leading-relaxed text-gray-800">
                    {item.question}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-xs text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="interview-answer px-5 pb-5 pt-4">
                  <p className="pl-8 text-xs leading-7 text-gray-600">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
