import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header";
import TemplatePreviewHero from "@/components/template/TemplatePreviewHero";
import TemplateSelectButton from "@/components/template/TemplateSelectButton";
import { getTemplate } from "@/lib/api/templates";

interface TemplatePreviewPageProps {
  params: Promise<{ templateId: string }>;
}

export default async function TemplatePreviewPage({
  params,
}: TemplatePreviewPageProps) {
  const { templateId } = await params;
  const id = Number(templateId);

  if (isNaN(id)) notFound();

  let template;
  try {
    template = await getTemplate(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-14">
        <div className="max-w-screen-lg mx-auto px-4 py-8">
          {/* 뒤로가기 */}
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <svg
              className="w-4 h-4"
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
            템플릿 목록
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* 미리보기 이미지 */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <TemplatePreviewHero template={template} />
            </div>

            {/* 템플릿 정보 + 선택 버튼 */}
            <div className="flex-1 lg:pt-8">
              <div className="mb-2">
                <span className="text-xs text-primary-500 font-medium uppercase tracking-widest">
                  Template
                </span>
              </div>
              <h1 className="text-3xl font-serif text-gray-800 mb-4">
                {template.name}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                감각적인 디자인으로 소중한 날을 더욱 특별하게 전달하세요. 원하는
                정보를 직접 입력하고 나만의 청첩장을 완성해보세요.
              </p>

              {/* 템플릿 특징 */}
              <div className="flex flex-col gap-3 mb-10">
                {[
                  "모바일 최적화 디자인",
                  "사진 및 갤러리 업로드",
                  "지도 및 오시는 길 안내",
                  "RSVP 및 방명록 기능",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-2.5 h-2.5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* 선택 버튼 */}
              <div className="max-w-xs">
                <TemplateSelectButton templateId={template.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
