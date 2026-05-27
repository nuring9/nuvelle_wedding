"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getAdminBgms, createAdminBgm, deleteAdminBgm } from "@/lib/api/admin";
import type { AdminBgm, AdminBgmRequest } from "@/types/admin";

const emptyForm: AdminBgmRequest = {
  title: "",
  fileUrl: "",
  mood: "",
  isActive: true,
  sortOrder: 0,
};

const MOOD_OPTIONS = ["잔잔한", "밝은", "감성적인", "로맨틱한", "청아한"];

export default function AdminBgmsPage() {
  const { accessToken } = useAuthStore();

  const [bgms, setBgms] = useState<AdminBgm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminBgmRequest>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let ignore = false;

    getAdminBgms(accessToken)
      .then((data) => {
        if (ignore) return;

        setBgms(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (ignore) return;

        if (err instanceof Error) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (ignore) return;

        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [accessToken]);

  const refreshBgms = async () => {
    if (!accessToken) return;

    try {
      const data = await getAdminBgms(accessToken);

      setBgms(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) return;

    try {
      await createAdminBgm(form, accessToken);

      setForm(emptyForm);
      setShowForm(false);

      await refreshBgms();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleDelete = async (bgmId: number) => {
    if (!accessToken) return;
    if (!confirm("이 BGM을 삭제하시겠습니까?")) return;

    setDeletingId(bgmId);

    try {
      await deleteAdminBgm(bgmId, accessToken);

      await refreshBgms();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm text-neutral-400">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-800">BGM 관리</h1>
          <p className="mt-1 text-sm text-neutral-400">
            총 {bgms.length}개 · 활성 {bgms.filter((b) => b.isActive).length}개
          </p>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          {showForm ? "취소" : "+ BGM 추가"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 추가 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-primary-100 bg-white p-6"
        >
          <h2 className="text-sm font-semibold text-neutral-700">
            새 BGM 등록
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                제목 *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예: It's Your Day"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                분위기
              </label>
              <select
                value={form.mood ?? ""}
                onChange={(e) => setForm({ ...form, mood: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              >
                <option value="">선택 안 함</option>
                {MOOD_OPTIONS.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                S3 파일 URL *
              </label>
              <input
                type="url"
                required
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://버킷명.s3.ap-northeast-2.amazonaws.com/bgm/..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                정렬 순서
              </label>
              <input
                type="number"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive ?? true}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-4 w-4 rounded border-neutral-300 text-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-neutral-600">
                활성화
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
              }}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
            >
              취소
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              등록
            </button>
          </div>
        </form>
      )}

      {/* BGM 목록 */}
      {bgms.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center">
          <p className="text-sm text-neutral-400">등록된 BGM이 없습니다.</p>
          <p className="mt-1 text-xs text-neutral-300">
            S3에 파일 업로드 후 위 버튼으로 등록하세요.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-100 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  순서
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  제목
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  분위기
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400">
                  미리듣기
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400">
                  관리
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-50">
              {bgms.map((bgm) => (
                <tr
                  key={bgm.id}
                  className="transition-colors hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 text-neutral-400">
                    {bgm.sortOrder}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {bgm.title}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {bgm.mood ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bgm.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {bgm.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <audio controls src={bgm.fileUrl} className="h-7 w-40" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(bgm.id)}
                      disabled={deletingId === bgm.id}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === bgm.id ? "삭제 중..." : "삭제"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
