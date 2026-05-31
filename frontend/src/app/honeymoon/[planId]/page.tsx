"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRef } from "react";
import HoneymoonDestinationImage from "@/components/honeymoon/HoneymoonDestinationImage";
import HoneymoonPdfTemplate from "@/components/honeymoon/HoneymoonPdfTemplate";
import { searchDestinationImages } from "@/lib/api/unsplash";
import { useAuthStore } from "@/stores/authStore";
import { useDialog } from "@/components/common/DialogProvider";
import Header from "@/components/common/Header";
import HoneymoonPlanDayCard from "@/components/honeymoon/HoneymoonPlanDayCard";
import HoneymoonDayEditModal from "@/components/honeymoon/HoneymoonDayEditModal";
import { getPlan, savePlan, updatePlanDay } from "@/lib/api/honeymoon";
import type {
  HoneymoonPlanResponse,
  HoneymoonPlanDayResponse,
  HoneymoonPlanDayUpdateRequest,
} from "@/types/honeymoon";

export default function HoneymoonPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = Number(params.planId);
  const { hasHydrated, isAuthenticated, accessToken } = useAuthStore();
  const { alert } = useDialog();

  const [plan, setPlan] = useState<HoneymoonPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDaySaving, setIsDaySaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<HoneymoonPlanDayResponse | null>(
    null,
  );

  // pdf 관련
  const [destinationImageUrl, setDestinationImageUrl] = useState<string | null>(
    null,
  );
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // 플랜 조회
  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!accessToken) return;

    const fetch = async () => {
      try {
        const data = await getPlan(planId, accessToken);
        setPlan(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [hasHydrated, isAuthenticated, accessToken, planId, router]);

  // 플랜 조회 후 여행지 이미지 가져오기
  useEffect(() => {
    if (!plan || !accessToken) return;
    const fetchImage = async () => {
      const photos = await searchDestinationImages(
        plan.destination,
        1,
        accessToken,
      );
      if (photos.length > 0) {
        setDestinationImageUrl(photos[0].urls.regular);
      }
    };
    fetchImage();
  }, [plan, accessToken]);

  // 플랜 확정 (DRAFT → SAVED)
  const handleSave = async () => {
    if (!accessToken || !plan) return;
    setIsSaving(true);
    try {
      const updated = await savePlan(planId, accessToken);
      setPlan(updated);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Day 일정 수정
  const handleDaySave = async (
    dayId: number,
    data: HoneymoonPlanDayUpdateRequest,
  ) => {
    if (!accessToken || !plan) return;
    setIsDaySaving(true);
    try {
      const updatedDay = await updatePlanDay(planId, dayId, data, accessToken);
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          days: prev.days.map((d) => (d.id === dayId ? updatedDay : d)),
        };
      });
      setEditingDay(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsDaySaving(false);
    }
  };

  // PDF 내보내기
  const handleExportPdf = async () => {
    if (!plan || isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      const [jsPDF, html2canvas] = await Promise.all([
        import("jspdf").then((m) => m.default),
        import("html2canvas").then((m) => m.default),
      ]);

      const template = document.getElementById("honeymoon-pdf-template");
      if (!template) return;
      await document.fonts.ready;

      const images = Array.from(template.querySelectorAll("img"));
      await Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          });
        }),
      );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const blockGap = 6;
      const contentWidth = pageWidth - margin * 2;
      let positionY = margin;

      const blocks = Array.from(
        template.querySelectorAll<HTMLElement>("[data-pdf-block]"),
      );

      for (const block of blocks) {
        const canvas = await html2canvas(block, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const blockHeight = (canvas.height * contentWidth) / canvas.width;
        const availableHeight = pageHeight - margin * 2;
        const renderHeight = Math.min(blockHeight, availableHeight);
        const renderWidth =
          blockHeight > availableHeight
            ? (canvas.width * renderHeight) / canvas.height
            : contentWidth;

        if (positionY > margin && positionY + renderHeight > pageHeight - margin) {
          pdf.addPage();
          positionY = margin;
        }

        pdf.addImage(
          imgData,
          "JPEG",
          margin,
          positionY,
          renderWidth,
          renderHeight,
        );
        positionY += renderHeight + blockGap;
      }

      pdf.save(`${plan.destination}-신혼여행-일정.pdf`);
    } catch (err) {
      console.error("PDF 내보내기 실패:", err);
      await alert("PDF 내보내기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center pt-32">
          <svg
            className="animate-spin h-8 w-8 text-primary-400"
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
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center pt-32 gap-4">
          <p className="text-gray-500 text-sm">
            {error || "플랜을 불러오지 못했습니다."}
          </p>
          <Link href="/honeymoon" className="btn-primary">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-14 max-w-screen-lg mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-start justify-between mt-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/honeymoon"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                신혼여행 플래너
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm text-gray-600">{plan.destination}</span>
            </div>
            <h1 className="text-xl font-serif text-gray-800">
              {plan.destination}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {plan.startDate} ~ {plan.endDate} · {plan.days.length}일 ·{" "}
              {plan.budget}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                plan.status === "SAVED"
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {plan.status === "SAVED" ? "확정됨" : "검토중"}
            </span>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="btn-ghost text-sm px-3 py-2 flex items-center gap-1.5"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {isExportingPdf ? "PDF 생성 중..." : "PDF 저장"}
            </button>

            {plan.status === "DRAFT" && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary text-sm px-4 py-2"
              >
                {isSaving ? "확정 중..." : "내 일정으로 확정"}
              </button>
            )}
          </div>
        </div>

        {/* 여행지 이미지 */}
        <HoneymoonDestinationImage
          destination={plan.destination}
          className="w-full aspect-[16/6] rounded-2xl mb-6"
        />

        {/* 요약 정보 */}
        {plan.travelStyle && (
          <div className="card-base p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {plan.travelStyle.split(", ").map((style) => (
                <span
                  key={style}
                  className="text-xs px-3 py-1 bg-primary-50 text-primary-600 rounded-full"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Day별 일정 */}
        {plan.days.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">
              일정 ({plan.days.length}일)
            </h2>
            {plan.days.map((day) => (
              <HoneymoonPlanDayCard
                key={day.id}
                day={day}
                onEdit={setEditingDay}
              />
            ))}
          </div>
        ) : (
          // Day 파싱 실패 시 AI 원본 텍스트 표시
          <div className="card-base p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              AI 생성 일정
            </h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {plan.aiGeneratedContent}
            </p>
          </div>
        )}
        {/* 2차 구현: 챗봇 링크 */}
        <div className="mt-8 p-5 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl">
          <p className="text-sm font-medium text-gray-700 mb-1">
            일정을 수정하고 싶으신가요?
          </p>
          <p className="text-xs text-gray-500 mb-4">
            AI 플래너에게 일정 수정을 요청하거나 여행 관련 질문을 해보세요.
          </p>
          <Link
            href={`/honeymoon/${plan.id}/chat`}
            className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            AI 플래너와 대화하기
          </Link>
        </div>
      </main>

      {/* PDF 템플릿 (숨겨진 상태로 렌더링) */}
      <div
        ref={pdfTemplateRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "794px",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <HoneymoonPdfTemplate
          plan={plan}
          imageUrl={destinationImageUrl ?? undefined}
        />
      </div>

      {/* Day 수정 모달 */}
      {editingDay && (
        <HoneymoonDayEditModal
          day={editingDay}
          onSave={handleDaySave}
          onClose={() => setEditingDay(null)}
          isSaving={isDaySaving}
        />
      )}
    </div>
  );
}
