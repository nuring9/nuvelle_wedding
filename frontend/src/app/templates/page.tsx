import { Suspense } from "react";
import Header from "@/components/common/Header";
import TemplateGrid from "@/components/template/TemplateGrid";
import { getTemplates } from "@/lib/api/templates";
import type { Template } from "@/types/template";

async function TemplateListContent() {
  let templates: Template[] = [];

  try {
    templates = await getTemplates();
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl mb-4">⚠️</span>
        <p className="text-gray-500 text-sm">
          템플릿을 불러오는 데 실패했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return <TemplateGrid templates={templates} />;
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-14">
        {/* 페이지 헤더 */}
        <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
          <h1 className="text-2xl font-serif text-gray-800 mb-2">
            청첩장 템플릿
          </h1>
          <p className="text-sm text-gray-500">
            마음에 드는 템플릿을 선택하고 나만의 청첩장을 만들어보세요
          </p>
        </div>

        {/* 템플릿 목록 */}
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="card-base overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-9 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <TemplateListContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "청첩장 템플릿",
  description: "다양한 모바일 청첩장 템플릿 중 원하는 디자인을 선택하세요.",
};
