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
    <div className="flex flex-col gap-3">
      {guestbooks.map((item) => (
        <div key={item.id} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">
              {item.guestName}
            </span>
            <span className="text-xs text-gray-400">
              {dayjs(item.createdAt).format("MM.DD")}
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}
