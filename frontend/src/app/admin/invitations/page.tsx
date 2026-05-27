"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getAdminInvitations } from "@/lib/api/admin";
import type { AdminInvitationSummary } from "@/types/admin";

export default function AdminInvitationsPage() {
  const { accessToken } = useAuthStore();
  const [invitations, setInvitations] = useState<AdminInvitationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const publishedCount = invitations.filter((inv) => inv.publishedAt).length;
  const weddingDateCount = invitations.filter((inv) => inv.weddingDate).length;

  useEffect(() => {
    if (!accessToken) return;
    const fetch = async () => {
      try {
        const data = await getAdminInvitations(accessToken);
        setInvitations(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-primary-100 bg-white p-8 text-center text-sm text-neutral-500 shadow-sm">
        발행 청첩장 목록을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl mt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-primary-600">
            Published Invitations
          </p>
          <h1 className="font-serif text-3xl font-semibold text-neutral-800">
            발행 청첩장
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            사용자들이 만든 청첩장과 공개 링크 상태를 확인합니다.
          </p>
        </div>
        <span className="self-start rounded-full border border-primary-100 bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm sm:self-auto">
          총 {invitations.length}건
        </span>
      </div>

      <div className="mb-6 grid max-w-2xl grid-cols-3 gap-3">
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">전체 청첩장</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">
            {invitations.length}
          </p>
        </div>
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">발행 완료</p>
          <p className="mt-1 text-xl font-semibold text-primary-600">
            {publishedCount}
          </p>
        </div>
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">예식일 입력</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">
            {weddingDateCount}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="border-b border-primary-100 bg-[#fff8f2]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  신랑/신부
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  예식일
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  예식장
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  사용자
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  템플릿
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  발행일
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  링크
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invitations.map((inv) => (
                <tr
                  key={inv.invitationId}
                  className="transition-colors hover:bg-neutral-50"
                >
                  <td className="px-5 py-4 font-medium text-neutral-900">
                    {inv.groomName ?? "-"} · {inv.brideName ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    {inv.weddingDate ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    {inv.venueName ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-neutral-900">{inv.userName}</div>
                    <div className="text-xs text-neutral-400">
                      {inv.userEmail}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    {inv.templateName}
                  </td>
                  <td className="px-5 py-4">
                    {inv.publishedAt ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {inv.publishedAt.slice(0, 10)}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">미발행</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={inv.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-100"
                    >
                      보기
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invitations.length === 0 && (
          <div className="py-12 text-center text-sm text-neutral-400">
            발행된 청첩장이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
