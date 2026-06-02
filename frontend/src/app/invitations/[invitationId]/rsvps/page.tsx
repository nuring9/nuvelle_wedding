"use client";

import RsvpResultList from "@/components/rsvp/RsvpResultList";
import { getRsvpList } from "@/lib/api/rsvp";
import { useAuthStore } from "@/stores/authStore";
import { RsvpResponse } from "@/types/invitation";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RsvpResultPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = Number(params.invitationId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();

  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!accessToken) return;
    if (isNaN(invitationId)) { router.replace("/invitations"); return; }

    const fetch = async () => {
      try {
        const data = await getRsvpList(invitationId, accessToken);
        setRsvps(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("참석 여부 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, invitationId, router]);

  const attendingCount = rsvps
    .filter((r) => r.attendanceStatus === "ATTENDING")
    .reduce((sum, r) => sum + r.guestCount, 0);
  const notAttendingCount = rsvps.filter((r) => r.attendanceStatus === "NOT_ATTENDING").length;
  const undecidedCount = rsvps.filter((r) => r.attendanceStatus === "UNDECIDED").length;
  const total = rsvps.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/invitations/${invitationId}/edit`}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-gray-800">참석 응답 확인</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <svg className="animate-spin h-6 w-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-gray-400 py-16">{error}</p>
        )}

        {!isLoading && !error && (
          <>
            {/* 통계 */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Summary</p>
                <p className="text-xs text-gray-400">총 {total}건</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="flex flex-col items-center gap-1 px-4">
                  <p className="text-3xl font-light text-gray-800">{attendingCount}</p>
                  <p className="text-[11px] text-gray-400">참석</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-4">
                  <p className="text-3xl font-light text-gray-800">{notAttendingCount}</p>
                  <p className="text-[11px] text-gray-400">불참</p>
                </div>
                <div className="flex flex-col items-center gap-1 px-4">
                  <p className="text-3xl font-light text-gray-800">{undecidedCount}</p>
                  <p className="text-[11px] text-gray-400">미정</p>
                </div>
              </div>

              {/* 비율 바 */}
              {total > 0 && (
                <div className="mt-5 flex h-1 rounded-full overflow-hidden gap-0.5">
                  {attendingCount > 0 && (
                    <div className="bg-gray-700 rounded-full" style={{ flex: attendingCount }} />
                  )}
                  {notAttendingCount > 0 && (
                    <div className="bg-gray-300 rounded-full" style={{ flex: notAttendingCount }} />
                  )}
                  {undecidedCount > 0 && (
                    <div className="bg-gray-200 rounded-full" style={{ flex: undecidedCount }} />
                  )}
                </div>
              )}
            </div>

            <RsvpResultList rsvps={rsvps} />
          </>
        )}
      </div>
    </div>
  );
}
