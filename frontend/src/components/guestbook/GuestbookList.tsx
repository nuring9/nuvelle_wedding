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
        <div key={item.id} className="py-4 first:pt-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">
              {item.guestName}
            </span>
            <span className="text-[10px] text-gray-300">
              {dayjs(item.createdAt).format("MM.DD")}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}
