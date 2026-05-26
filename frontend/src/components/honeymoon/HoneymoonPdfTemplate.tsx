import type { HoneymoonPlanResponse } from "@/types/honeymoon";

interface HoneymoonPdfTemplateProps {
  plan: HoneymoonPlanResponse;
  imageUrl?: string;
}

export default function HoneymoonPdfTemplate({
  plan,
  imageUrl,
}: HoneymoonPdfTemplateProps) {
  const renderPdfItem = (
    text: string,
    index: number,
    colors: { background: string; text: string },
  ) => (
    <div
      key={index}
      style={{
        display: "block",
        position: "relative",
        marginBottom: "6px",
        padding: "8px 12px 7px",
        color: colors.text,
        fontSize: "13px",
        fontWeight: 400,
        lineHeight: "1.55",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        wordBreak: "keep-all",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "14px",
          bottom: "0",
          background: colors.background,
          borderRadius: "6px",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
    </div>
  );

  return (
    <div
      id="honeymoon-pdf-template"
      className="bg-white p-10"
      style={{ width: "794px", fontFamily: "sans-serif" }}
    >
      <div
        data-pdf-block
        style={{
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "32px",
          paddingBottom: "32px",
        }}
      >
        {/* 헤더 */}
        <div>
          {/* 여행지 이미지 */}
          {imageUrl && (
            <div
              className="w-full mb-6 rounded-xl overflow-hidden"
              style={{ height: "240px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={plan.destination}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* 제목 */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            {plan.destination} 신혼여행 일정
          </h1>

          {/* 기본 정보 */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            <span>
              📅 {plan.startDate} ~ {plan.endDate}
            </span>
            <span>💰 {plan.budget}</span>
            {plan.travelStyle && <span>✈️ {plan.travelStyle}</span>}
          </div>
        </div>
      </div>

      {/* Day별 일정 */}
      {plan.days.map((day) => (
        <div key={day.id} data-pdf-block style={{ marginBottom: "32px" }}>
          {/* Day 헤더 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "36px",
                position: "relative",
                display: "block",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "10px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#da6d2a",
                }}
              />
              <span
                style={{
                  position: "relative",
                  display: "block",
                  lineHeight: "32px",
                  paddingTop: "4px",
                }}
              >
                {day.dayNumber}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {day.title}
              </p>
              {day.date && (
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  {day.date}
                </p>
              )}
            </div>
          </div>

          {/* 설명 */}
          {day.description && (
            <p
              style={{
                fontSize: "13px",
                color: "#4b5563",
                lineHeight: "1.6",
                marginBottom: "12px",
                marginLeft: "44px",
              }}
            >
              {day.description}
            </p>
          )}

          {/* 활동 */}
          {day.activities.length > 0 && (
            <div style={{ marginLeft: "44px", marginBottom: "8px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                활동
              </p>
              <div style={{ display: "block" }}>
                {day.activities.map((activity, index) =>
                  renderPdfItem(activity, index, {
                    background: "#eff6ff",
                    text: "#2563eb",
                  }),
                )}
              </div>
            </div>
          )}

          {/* 식사 */}
          {day.meals.length > 0 && (
            <div style={{ marginLeft: "44px", marginBottom: "8px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                식사
              </p>
              <div style={{ display: "block" }}>
                {day.meals.map((meal, index) =>
                  renderPdfItem(meal, index, {
                    background: "#fff7ed",
                    text: "#ea580c",
                  }),
                )}
              </div>
            </div>
          )}

          {/* 팁 */}
          {day.tips && (
            <div
              style={{
                marginLeft: "44px",
                position: "relative",
                padding: "9px 12px 8px",
                fontSize: "12px",
                lineHeight: "1.6",
                color: "#a16207",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "14px",
                  bottom: 0,
                  backgroundColor: "#fefce8",
                  borderRadius: "8px",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                💡 {day.tips}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* 푸터 */}
      <div
        data-pdf-block
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "16px",
          marginTop: "16px",
          fontSize: "11px",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        Nuvelle | 신혼여행 AI 플래너로 생성된 일정입니다.
      </div>
    </div>
  );
}
