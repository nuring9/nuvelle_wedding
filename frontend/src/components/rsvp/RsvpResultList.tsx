import type { RsvpResponse } from "@/types/invitation";

interface RsvpResultListProps {
  rsvps: RsvpResponse[];
}

const attendanceLabel = {
  ATTENDING: "참석",
  NOT_ATTENDING: "불참",
  UNDECIDED: "미정",
};

const attendanceColor = {
  ATTENDING: "text-green-600 bg-green-50",
  NOT_ATTENDING: "text-red-500 bg-red-50",
  UNDECIDED: "text-yellow-600 bg-yellow-50",
};

export default function RsvpResultList({ rsvps }: RsvpResultListProps) {
  if (rsvps.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        아직 RSVP 응답이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rsvps.map((rsvp) => (
        <div key={rsvp.id} className="card-base p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800">
              {rsvp.guestName}
            </span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                attendanceColor[rsvp.attendanceStatus]
                // 객체의 key를 변수 값으로 접근해야 하기 때문에 [] 사용, 즉 object[key]
              }`}
            >
              {attendanceLabel[rsvp.attendanceStatus]}
            </span>
          </div>
          {rsvp.attendanceStatus === "ATTENDING" && (
            <p className="text-xs text-gray-400">{rsvp.guestCount}명 참석</p>
          )}
          {rsvp.message && (
            <p className="text-xs text-gray-500 mt-1">{rsvp.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}
