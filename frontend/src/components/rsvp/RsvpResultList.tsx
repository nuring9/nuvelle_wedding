import type { RsvpResponse } from "@/types/invitation";

interface RsvpResultListProps {
  rsvps: RsvpResponse[];
}

const statusConfig = {
  ATTENDING: { label: "참석", dot: "bg-gray-700" },
  NOT_ATTENDING: { label: "불참", dot: "bg-gray-300" },
  UNDECIDED: { label: "미정", dot: "bg-gray-200" },
};

export default function RsvpResultList({ rsvps }: RsvpResultListProps) {
  if (rsvps.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">
        아직 응답이 없습니다.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {rsvps.map((rsvp, index) => {
        const config = statusConfig[rsvp.attendanceStatus];
        return (
          <div
            key={rsvp.id}
            className={`px-5 py-4 flex items-center gap-4 ${
              index !== rsvps.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{rsvp.guestName}</p>
              {rsvp.message && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{rsvp.message}</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {rsvp.attendanceStatus === "ATTENDING" && (
                <p className="text-xs text-gray-400">{rsvp.guestCount}명</p>
              )}
              <p className="text-xs text-gray-500">{config.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
