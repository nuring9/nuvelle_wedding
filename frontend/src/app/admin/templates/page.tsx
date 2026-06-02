"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useDialog } from "@/components/common/DialogProvider";
import {
  getAdminTemplates,
  createAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
} from "@/lib/api/admin";
import { uploadFile } from "@/lib/api/file";
import type { AdminTemplate, AdminTemplateRequest } from "@/types/admin";
import { THEME_OPTIONS } from "@/constants/invitation";

// 새 템플릿 생성 폼의 초기값
const emptyForm: AdminTemplateRequest = {
  name: "",
  thumbnailUrl: "",
  themeKey: "",
  layoutKey: "",
  description: "",
  active: true,
  sortOrder: 0,
};

export default function AdminTemplatesPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const { confirm } = useDialog();

  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminTemplateRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const activeCount = templates.filter((template) => template.active).length;
  const masterCount = templates.filter(
    (template) => template.masterInvitationId,
  ).length;

  const fetchTemplates = async () => {
    if (!accessToken) return;
    try {
      const data = await getAdminTemplates(accessToken);
      setTemplates(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;

    const loadTemplates = async () => {
      try {
        const data = await getAdminTemplates(accessToken);

        if (!isMounted) return;

        setTemplates(data);
      } catch (err: unknown) {
        if (!isMounted) return;

        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        if (!isMounted) return;

        setIsLoading(false);
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleImageUpload = async (file: File, directory: string) => {
    if (!accessToken) return;

    try {
      setError(null);

      setIsUploadingThumbnail(true);

      const uploaded = await uploadFile(file, directory, accessToken);

      setForm((prev) => ({
        ...prev,
        thumbnailUrl: uploaded.url,
      }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) return;
    try {
      if (editingId !== null) {
        await updateAdminTemplate(editingId, form, accessToken);
      } else {
        await createAdminTemplate(form, accessToken);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleEdit = (template: AdminTemplate) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      thumbnailUrl: template.thumbnailUrl ?? "",
      themeKey: template.themeKey ?? "",
      layoutKey: template.layoutKey ?? "",
      description: template.description ?? (THEME_OPTIONS.find((t) => t.key === template.themeKey)?.description ?? ""),
      active: template.active,
      sortOrder: template.sortOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: number) => {
    if (!accessToken) return;
    if (!(await confirm("이 템플릿을 삭제하시겠습니까?"))) return;
    try {
      await deleteAdminTemplate(templateId, accessToken);
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-primary-100 bg-white p-8 text-center text-sm text-neutral-500 shadow-sm">
        템플릿 목록을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl mt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-primary-600">
            Admin Studio
          </p>
          <h1 className="font-serif text-3xl font-semibold text-neutral-900">
            템플릿 관리
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            사용자에게 보여줄 청첩장 템플릿과 마스터 청첩장을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="self-start rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 sm:self-auto"
        >
          + 새 템플릿
        </button>
      </div>

      <div className="mb-6 grid max-w-2xl grid-cols-3 gap-3">
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">전체 템플릿</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">
            {templates.length}
          </p>
        </div>
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">활성 템플릿</p>
          <p className="mt-1 text-xl font-semibold text-sky-700">
            {activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-neutral-400">마스터 설정</p>
          <p className="mt-1 text-xl font-semibold text-neutral-900">
            {masterCount}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            {editingId !== null ? "템플릿 수정" : "새 템플릿 추가"}
          </h2>
          <div className="flex flex-col gap-3">
            {/* 행 1: 이름 + 테마 키 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <span className="text-sm text-neutral-500 whitespace-nowrap">템플릿 이름</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 outline-none text-sm text-neutral-900"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <span className="text-sm text-neutral-500 whitespace-nowrap">테마 키</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <input
                  value={form.themeKey ?? ""}
                  onChange={(e) => {
                    const key = e.target.value;
                    const matched = THEME_OPTIONS.find((t) => t.key === key);
                    setForm({
                      ...form,
                      themeKey: key,
                      description: matched ? matched.description : form.description,
                    });
                  }}
                  className="w-28 outline-none text-sm text-neutral-900"
                />
              </div>
            </div>
            {/* 행 2: 썸네일 + 정렬순서 + 활성화 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  disabled={isUploadingThumbnail}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleImageUpload(file, "templates/thumbnail");
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingThumbnail}
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
                >
                  썸네일 업로드
                </button>
                <span className={`text-sm ${form.thumbnailUrl ? "text-sky-700" : "text-neutral-400"}`}>
                  {isUploadingThumbnail ? "업로드 중..." : form.thumbnailUrl ? "등록됨" : "없음"}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-neutral-700 whitespace-nowrap">
                  <span className="text-neutral-500">순서</span>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-8 text-center outline-none text-sm"
                  />
                </label>
                <label className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-neutral-700 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={form.active ?? true}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="h-4 w-4 accent-neutral-900"
                  />
                  활성화
                </label>
              </div>
            </div>
            {/* 행 3: 소개 문구 */}
            <textarea
              placeholder="템플릿 소개 문구 (예: 순백의 여백과 단정한 구성이 돋보이는 클래식한 청첩장입니다.)"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-base resize-none"
            />
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              저장
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-primary-100"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-sm">
            <thead className="border-b border-primary-100 bg-[#fff8f2]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  이름
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  슬러그
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  정렬
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  상태
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  마스터
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((t) => (
                <tr
                  key={t.id}
                  className="transition-colors hover:bg-neutral-50"
                >
                  <td className="px-5 py-4 font-medium text-neutral-900">
                    {t.name}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">{t.slug}</td>
                  <td className="px-5 py-4 text-neutral-500">{t.sortOrder}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${t.active ? "bg-sky-50 text-sky-700" : "bg-neutral-100 text-neutral-400"}`}
                    >
                      {t.active ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {t.masterInvitationId ? (
                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                        설정됨
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">미설정</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/templates/${t.id}/edit`)
                        }
                        className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                      >
                        마스터 편집
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-100"
                      >
                        정보 수정
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {templates.length === 0 && (
          <div className="py-12 text-center text-sm text-neutral-400">
            템플릿이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
