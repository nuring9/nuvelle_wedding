"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
  getAdminTemplates,
  createAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
} from "@/lib/api/admin";
import type { AdminTemplate, AdminTemplateRequest } from "@/types/admin";

// 새 템플릿 생성 폼의 초기값
const emptyForm: AdminTemplateRequest = {
  name: "",
  slug: "",
  thumbnailUrl: "",
  themeKey: "",
  layoutKey: "",
  active: true,
  sortOrder: 0,
};

export default function AdminTemplatesPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminTemplateRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      slug: template.slug,
      thumbnailUrl: template.thumbnailUrl ?? "",
      themeKey: template.themeKey ?? "",
      layoutKey: template.layoutKey ?? "",
      active: template.active,
      sortOrder: template.sortOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (templateId: number) => {
    if (!accessToken) return;
    if (!confirm("이 템플릿을 삭제하시겠습니까?")) return;
    try {
      await deleteAdminTemplate(templateId, accessToken);
      fetchTemplates();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">불러오는 중...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">템플릿 관리</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
        >
          + 새 템플릿
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded-xl border">
          <h2 className="text-sm font-semibold mb-3 text-gray-700">
            {editingId !== null ? "템플릿 수정" : "새 템플릿 추가"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="슬러그 (예: classic-white)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="썸네일 URL"
              value={form.thumbnailUrl ?? ""}
              onChange={(e) =>
                setForm({ ...form, thumbnailUrl: e.target.value })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="테마 키"
              value={form.themeKey ?? ""}
              onChange={(e) => setForm({ ...form, themeKey: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="정렬 순서"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active ?? true}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              활성화
            </label>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
            >
              저장
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600">이름</th>
              <th className="text-left px-4 py-3 text-gray-600">슬러그</th>
              <th className="text-left px-4 py-3 text-gray-600">정렬</th>
              <th className="text-left px-4 py-3 text-gray-600">상태</th>
              <th className="text-left px-4 py-3 text-gray-600">마스터</th>
              <th className="text-left px-4 py-3 text-gray-600">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {t.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{t.slug}</td>
                <td className="px-4 py-3 text-gray-500">{t.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${t.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {t.active ? "활성" : "비활성"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.masterInvitationId ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                      설정됨
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">미설정</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/templates/${t.id}/edit`)
                      }
                      className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      마스터 편집
                    </button>
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      정보 수정
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {templates.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            템플릿이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
