import Link from "next/link";
import type { HoneymoonPlanSummaryResponse } from "@/types/honeymoon";

interface HoneymoonPlanCardProps {
  plan: HoneymoonPlanSummaryResponse;
  onDelete: (planId: number) => void;
}

export default function HoneymoonPlanCard({
  plan,
  onDelete,
}: HoneymoonPlanCardProps) {
  const statusLabel = plan.status === "SAVED" ? "확정됨" : "검토중";
  const statusColor =
    plan.status === "SAVED"
      ? "bg-green-50 text-green-600"
      : "bg-amber-50 text-amber-600";

  return (
    <div className="card-base overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">
            {plan.destination}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {plan.startDate} ~ {plan.endDate} · {plan.totalDays}일
        </p>
      </div>

      {/* 정보 */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>💰</span>
          <span>{plan.budget}</span>
        </div>
        {plan.travelStyle && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>✈️</span>
            <span>{plan.travelStyle}</span>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/honeymoon/${plan.id}`}
          className="btn-primary flex-1 text-center text-xs py-2"
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
