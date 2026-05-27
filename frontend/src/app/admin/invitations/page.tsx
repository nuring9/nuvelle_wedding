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
    return <div className="text-sm text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">발행된 청첩장</h1>
        <span className="text-sm text-gray-500">총 {invitations.length}건</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600">신랑/신부</th>
              <th className="text-left px-4 py-3 text-gray-600">예식일</th>
              <th className="text-left px-4 py-3 text-gray-600">예식장</th>
              <th className="text-left px-4 py-3 text-gray-600">사용자</th>
              <th className="text-left px-4 py-3 text-gray-600">템플릿</th>
              <th className="text-left px-4 py-3 text-gray-600">발행일</th>
              <th className="text-left px-4 py-3 text-gray-600">링크</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invitations.map((inv) => (
              <tr key={inv.invitationId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">
                  {inv.groomName ?? "-"} · {inv.brideName ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {inv.weddingDate ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {inv.venueName ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-800">{inv.userName}</div>
                  <div className="text-gray-400 text-xs">{inv.userEmail}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{inv.templateName}</td>
                <td className="px-4 py-3 text-gray-500">
                  {inv.publishedAt ? inv.publishedAt.slice(0, 10) : "-"}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={inv.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs hover:underline"
                  >
                    보기
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invitations.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            발행된 청첩장이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
