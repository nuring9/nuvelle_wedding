import type { GuestbookResponse } from "@/types/invitation";
import dayjs from "dayjs";

interface GuestbookListProps {
  guestbooks: GuestbookResponse[];
}

export default function GuestbookList({ guestbooks }: GuestbookListProps) {
  if (guestbooks.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        아직 방명록이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {guestbooks.map((item) => (
        <div key={item.id} className="py-3.5 first:pt-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-gray-700 shrink-0">
              {item.guestName}
            </span>
            <span className="text-[10px] text-gray-300 shrink-0">
              {dayjs(item.createdAt).format("MM.DD")}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}
