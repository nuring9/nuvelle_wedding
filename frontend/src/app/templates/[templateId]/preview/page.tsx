export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/Header";
import TemplatePreviewHero from "@/components/template/TemplatePreviewHero";
import TemplateSelectButton from "@/components/template/TemplateSelectButton";
import { getTemplate } from "@/lib/api/templates";

function getTemplateDescription(slug: string, name: string) {
  const descriptions: Record<string, string> = {
    "classic-white":
      "순백의 여백과 단정한 구성이 돋보이는 클래식한 청첩장입니다. 차분하고 우아한 분위기로 예식의 품격을 전해보세요.",
    "bright-sunshine":
      "밝은 햇살처럼 화사하고 따뜻한 분위기를 담은 템플릿입니다. 산뜻하고 기분 좋은 예식의 설렘을 자연스럽게 전해보세요.",
    "romantic-floral":
      "부드러운 플라워 무드로 따뜻하고 로맨틱한 분위기를 담았습니다. 사랑스러운 예식 감성을 자연스럽게 전해보세요.",
    "natural-garden":
      "싱그러운 정원 감성을 담은 내추럴한 템플릿입니다. 편안하고 따뜻한 분위기의 야외 예식에도 잘 어울립니다.",
    "elegance-gold":
      "은은한 골드 포인트로 고급스러운 분위기를 완성한 템플릿입니다. 격식 있고 특별한 예식 안내에 잘 어울립니다.",
    "simple-black":
      "블랙 컬러의 절제된 무드가 돋보이는 모던한 템플릿입니다. 시크하고 감각적인 청첩장을 만들고 싶을 때 추천합니다.",
  };

  return (
    descriptions[slug] ??
    `${name}의 분위기에 맞춰 예식 정보를 자연스럽게 담을 수 있는 청첩장 템플릿입니다.`
  );
}

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
                {getTemplateDescription(template.slug, template.name)}
              </p>

              {/* 템플릿 특징 */}
              <div className="flex flex-col gap-3 mb-10">
                {[
                  "모바일 최적화 디자인",
                  "사진 및 갤러리 업로드",
                  "지도 및 오시는 길 안내",
                  "참석 여부 응답 및 방명록 기능",
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
