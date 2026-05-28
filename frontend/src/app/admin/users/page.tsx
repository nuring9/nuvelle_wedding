"use client";

import { useEffect, useState } from "react";
import {
  getAdminUser,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  withdrawAdminUser,
} from "@/lib/api/admin";
import { useAuthStore } from "@/stores/authStore";
import type { AdminUser, UserRole, UserStatus } from "@/types/admin";

const statusLabel: Record<UserStatus, string> = {
  ACTIVE: "활성",
  WITHDRAWN: "탈퇴",
  SUSPENDED: "정지",
};

const roleLabel: Record<UserRole, string> = {
  ROLE_USER: "일반 회원",
  ROLE_ADMIN: "관리자",
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export default function AdminUsersPage() {
  const { accessToken, user } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers(accessToken, { keyword, status });
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAdminUsers(accessToken, { keyword: "", status: "" });
        if (!isMounted) return;
        setUsers(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "회원 목록을 불러오지 못했습니다.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const refreshSelectedUser = async (userId: number) => {
    if (!accessToken) return;
    const detail = await getAdminUser(userId, accessToken);
    setSelectedUser(detail);
  };

  const handleStatusChange = async (targetUser: AdminUser, nextStatus: UserStatus) => {
    if (!accessToken) return;

    try {
      const updated = await updateAdminUserStatus(targetUser.id, nextStatus, accessToken);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedUser?.id === updated.id) await refreshSelectedUser(updated.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "회원 상태 변경에 실패했습니다.");
    }
  };

  const handleRoleChange = async (targetUser: AdminUser, nextRole: UserRole) => {
    if (!accessToken) return;

    try {
      const updated = await updateAdminUserRole(targetUser.id, nextRole, accessToken);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedUser?.id === updated.id) await refreshSelectedUser(updated.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "회원 권한 변경에 실패했습니다.");
    }
  };

  const handleWithdraw = async (targetUser: AdminUser) => {
    if (!accessToken) return;
    if (!confirm(`${targetUser.email} 회원을 탈퇴 처리하시겠습니까?`)) return;

    try {
      const updated = await withdrawAdminUser(targetUser.id, accessToken);
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedUser?.id === updated.id) await refreshSelectedUser(updated.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "회원 탈퇴 처리에 실패했습니다.");
    }
  };

  const handleSelectUser = async (userId: number) => {
    if (!accessToken) return;

    try {
      const detail = await getAdminUser(userId, accessToken);
      setSelectedUser(detail);
    } catch (err) {
      alert(err instanceof Error ? err.message : "회원 상세 정보를 불러오지 못했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-primary-600">
            Admin Studio
          </p>
          <h1 className="font-serif text-3xl font-semibold text-neutral-900">
            회원 관리
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            가입 회원의 상태, 권한, 탈퇴 이력을 관리합니다.
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") fetchUsers();
          }}
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-primary-300"
          placeholder="이메일 또는 이름 검색"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as UserStatus | "")}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm outline-none focus:border-primary-300"
        >
          <option value="">전체 상태</option>
          <option value="ACTIVE">활성</option>
          <option value="SUSPENDED">정지</option>
          <option value="WITHDRAWN">탈퇴</option>
        </select>
        <button
          type="button"
          onClick={fetchUsers}
          className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white"
        >
          조회
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">회원</th>
                <th className="px-4 py-3">권한</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">가입 방식</th>
                <th className="px-4 py-3">가입일</th>
                <th className="px-4 py-3">탈퇴일</th>
                <th className="px-4 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                    회원 목록을 불러오는 중입니다.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                    조회된 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleSelectUser(member.id)}
                        className="text-left"
                      >
                        <span className="block font-medium text-neutral-900">
                          {member.name}
                        </span>
                        <span className="block text-xs text-neutral-500">
                          {member.email}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={member.role}
                        disabled={member.id === user?.userId}
                        onChange={(event) =>
                          handleRoleChange(member, event.target.value as UserRole)
                        }
                        className="rounded-lg border border-neutral-200 px-3 py-2 text-xs disabled:bg-neutral-100"
                      >
                        <option value="ROLE_USER">일반 회원</option>
                        <option value="ROLE_ADMIN">관리자</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={member.status}
                        onChange={(event) =>
                          handleStatusChange(member, event.target.value as UserStatus)
                        }
                        className="rounded-lg border border-neutral-200 px-3 py-2 text-xs"
                      >
                        <option value="ACTIVE">활성</option>
                        <option value="SUSPENDED">정지</option>
                        <option value="WITHDRAWN">탈퇴</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{member.provider}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatDate(member.deletedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleWithdraw(member)}
                        disabled={member.role === "ROLE_ADMIN" || member.status === "WITHDRAWN"}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        탈퇴 처리
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">회원 상세</h2>
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="text-sm text-neutral-400 hover:text-neutral-700"
            >
              닫기
            </button>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-neutral-400">이메일</dt>
              <dd className="mt-1 font-medium text-neutral-900">{selectedUser.email}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">권한</dt>
              <dd className="mt-1 font-medium text-neutral-900">
                {roleLabel[selectedUser.role]}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-400">상태</dt>
              <dd className="mt-1 font-medium text-neutral-900">
                {statusLabel[selectedUser.status]}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-400">청첩장 수</dt>
              <dd className="mt-1 font-medium text-neutral-900">
                {selectedUser.invitationCount ?? 0}개
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
