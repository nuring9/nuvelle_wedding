import type { HoneymoonPlanDayResponse } from "@/types/honeymoon";

interface HoneymoonPlanDayCardProps {
  day: HoneymoonPlanDayResponse;
  onEdit: (day: HoneymoonPlanDayResponse) => void;
}

export default function HoneymoonPlanDayCard({
  day,
  onEdit,
}: HoneymoonPlanDayCardProps) {
  return (
    <div className="card-base p-5">
      {/* Day 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-600">
              {day.dayNumber}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{day.title}</p>
            {day.date && <p className="text-xs text-gray-400">{day.date}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onEdit(day)}
          className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
        >
          수정
        </button>
      </div>

      {/* 설명 */}
      {day.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
          {day.description}
        </p>
      )}

      {/* 활동 */}
      {day.activities.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">활동</p>
          <div className="flex flex-wrap gap-1.5">
            {day.activities.map((activity, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 식사 */}
      {day.meals.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">식사</p>
          <div className="flex flex-wrap gap-1.5">
            {day.meals.map((meal, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full"
              >
                {meal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 팁 */}
      {day.tips && (
        <div className="mt-3 p-3 bg-yellow-50 rounded-xl">
          <p className="text-xs text-yellow-700">💡 {day.tips}</p>
        </div>
      )}
    </div>
  );
}
