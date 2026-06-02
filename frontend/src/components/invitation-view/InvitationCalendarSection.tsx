import type { PublicInvitation } from "@/types/invitation";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

interface InvitationCalendarSectionProps {
  invitation: PublicInvitation;
}

const KO_ORDINALS = [
  "", "첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열",
  "열하나", "열둘", "열셋", "열넷", "열다섯", "열여섯", "열일곱", "열여덟", "열아홉", "스물",
  "스물하나", "스물둘", "스물셋", "스물넷", "스물다섯", "스물여섯", "스물일곱", "스물여덟", "스물아홉", "서른", "서른하나",
];

export default function InvitationCalendarSection({
  invitation,
}: InvitationCalendarSectionProps) {
  if (!invitation.calendarEnabled || !invitation.weddingDate) return null;

  const weddingDay = dayjs(invitation.weddingDate);
  const year = weddingDay.year();
  const month = weddingDay.month();
  const dayOfMonth = weddingDay.date();

  const firstDayOfMonth = dayjs(new Date(year, month, 1));
  const daysInMonth = weddingDay.daysInMonth();
  const startDow = firstDayOfMonth.day();

  const formattedTime = invitation.weddingTime
    ? dayjs(`2000-01-01 ${invitation.weddingTime}`).format("A h시")
    : null;

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const monthLabel = `${weddingDay.month() + 1}월의`;
  const dayLabel = `${KO_ORDINALS[dayOfMonth] ?? dayOfMonth} 번째 날.`;
  const dow = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <section className="section-padding">
      <div className="w-full max-w-xs mx-auto">
        {/* 헤더 텍스트 */}
        <div className="mb-5">
          <p className="text-sm font-light text-gray-400 leading-snug tracking-wide">
            {monthLabel}
          </p>
          <p className="text-sm font-light text-gray-400 leading-snug tracking-wide">
            {dayLabel}
          </p>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200" />

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mt-4 mb-1">
          {dow.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[11px] font-medium ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        {weeks.map((w, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {w.map((d, di) => {
              const isWedding = d === dayOfMonth;
              const isSun = di === 0;
              const isSat = di === 6;
              return (
                <div
                  key={di}
                  className="flex flex-col items-center justify-center py-1"
                >
                  {d !== null && (
                    <>
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${
                          isWedding
                            ? "bg-gray-500 text-white font-semibold"
                            : isSun
                            ? "text-red-400"
                            : isSat
                            ? "text-blue-400"
                            : "text-gray-600"
                        }`}
                      >
                        {d}
                      </span>
                      {isWedding && formattedTime && (
                        <span className="text-[9px] text-gray-400 mt-0.5 leading-none">
                          {formattedTime}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
