import Link from "next/link";
import type { HoneymoonPlanSummaryResponse } from "@/types/honeymoon";

interface HoneymoonPlanCardProps {
  plan: HoneymoonPlanSummaryResponse;
  onDelete: (planId: number) => void;
}

const destinationEmoji: Record<string, string> = {
  "발리": "🌴",
  "파리": "🗼",
  "도쿄": "🗾",
  "뉴욕": "🗽",
  "하와이": "🌺",
  "방콕": "🛕",
  "로마": "🏛️",
  "몰디브": "🏝️",
  "제주": "🍊",
  "푸꾸옥": "🌊",
};

export default function HoneymoonPlanCard({
  plan,
  onDelete,
}: HoneymoonPlanCardProps) {
  const isConfirmed = plan.status === "SAVED";
  const emoji = destinationEmoji[plan.destination] ?? "✈️";

  return (
    <div className="card-base overflow-hidden flex flex-col">
      {/* 상단 배너 */}
      <div className={`px-5 pt-5 pb-4 ${isConfirmed ? "bg-gradient-to-br from-primary-50 to-orange-50" : "bg-gradient-to-br from-gray-50 to-amber-50"}`}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{emoji}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isConfirmed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
            {isConfirmed ? "확정됨" : "검토중"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{plan.destination}</h3>
        <p className="text-xs text-gray-400">{plan.startDate} ~ {plan.endDate}</p>
      </div>

      {/* 정보 */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">기간</p>
            <p className="text-sm font-medium text-gray-700">{plan.totalDays}일</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">예산</p>
            <p className="text-sm font-medium text-gray-700">{plan.budget}</p>
          </div>
          {plan.travelStyle && (
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">스타일</p>
              <p className="text-sm font-medium text-gray-700">{plan.travelStyle}</p>
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="px-5 pb-5 flex gap-2 justify-end border-t border-gray-100 pt-3">
        <Link
          href={`/honeymoon/${plan.id}`}
          className="btn-primary text-center text-xs px-4"
        >
          상세 보기
        </Link>
        <button
          type="button"
          onClick={() => onDelete(plan.id)}
          className="btn-ghost text-xs px-3 py-2 text-red-400 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
