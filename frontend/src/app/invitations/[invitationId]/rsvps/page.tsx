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

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!accessToken) return;

    if (isNaN(invitationId)) {
      router.replace("/invitations");
      return;
    }

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

  // 참석 인원 수 reduce 로 누적값
  const attendingCount = rsvps
    .filter((r) => r.attendanceStatus === "ATTENDING")
    .reduce((sum, r) => sum + r.guestCount, 0);

  // 불참
  const notAttendingCount = rsvps.filter(
    (r) => r.attendanceStatus === "NOT_ATTENDING",
  ).length;

  // 미정
  const undecidedCount = rsvps.filter(
    (r) => r.attendanceStatus === "UNDECIDED",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/invitations/${invitationId}/edit`}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-gray-800">
          참석 응답 확인
        </h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 로딩 */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <svg
              className="animate-spin h-7 w-7 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* 통계 + 목록 */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="card-base p-4 text-center">
                <p className="text-2xl font-semibold text-green-600">
                  {attendingCount}
                </p>
                <p className="text-xs text-gray-400 mt-1">참석 인원</p>
              </div>
              <div className="card-base p-4 text-center">
                <p className="text-2xl font-semibold text-red-400">
                  {notAttendingCount}
                </p>
                <p className="text-xs text-gray-400 mt-1">불참</p>
              </div>
              <div className="card-base p-4 text-center">
                <p className="text-2xl font-semibold text-yellow-500">
                  {undecidedCount}
                </p>
                <p className="text-xs text-gray-400 mt-1">미정</p>
              </div>
            </div>
            <RsvpResultList rsvps={rsvps} />
          </>
        )}
      </div>
    </div>
  );
}
