package com.nuvelle.wedding.honeymoon.ai;

import com.nuvelle.wedding.honeymoon.dto.HoneymoonPlanGenerateRequest;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class HoneymoonPromptBuilder {

    public String buildPrompt(HoneymoonPlanGenerateRequest request) {
        long totalDays = ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate()) + 1;

        StringBuilder sb = new StringBuilder();

        sb.append("당신은 신혼여행 전문 플래너입니다.\n");
        sb.append("아래 여행 조건을 반드시 모두 반영하여 신혼여행 일정을 JSON 형식으로만 생성해주세요.\n");
        sb.append("JSON 외 다른 텍스트나 설명은 절대 포함하지 마세요.\n\n");

        sb.append("=== 여행 조건 (모두 엄격히 준수) ===\n");
        sb.append("여행지: ").append(request.getDestination()).append("\n");
        sb.append("출발일: ").append(request.getStartDate()).append("\n");
        sb.append("도착일: ").append(request.getEndDate()).append("\n");
        sb.append("총 여행 기간: ").append(totalDays).append("일\n");
        sb.append("예산: ").append(request.getBudget())
          .append(" (1인 기준이면 2인 총 예산은 2배로 계산할 것)\n");

        List<String> styles = request.getTravelStyles();
        if (styles != null && !styles.isEmpty()) {
            sb.append("여행 스타일: ").append(String.join(", ", styles))
              .append(" → 하루 일정의 activities와 meals이 이 스타일 위주로 구성되어야 합니다.\n");
        }

        if (request.getCompanionStyle() != null && !request.getCompanionStyle().isBlank()) {
            sb.append("동반자 특성: ").append(request.getCompanionStyle())
              .append(" → 이동 거리, 체력 소모, 일정 강도를 이 특성에 맞게 조정하세요.\n");
        }

        if (request.getMustInclude() != null && !request.getMustInclude().isBlank()) {
            sb.append("반드시 포함할 것: ").append(request.getMustInclude())
              .append(" → 이 항목들은 일정 어딘가에 반드시 포함되어야 합니다.\n");
        }

        if (request.getMustExclude() != null && !request.getMustExclude().isBlank()) {
            sb.append("절대 포함하지 말 것: ").append(request.getMustExclude())
              .append(" → 이 항목들은 activities, meals, tips 어디에도 등장하면 안 됩니다.\n");
        }

        sb.append("\n=== 예산 준수 규칙 ===\n");
        sb.append("- budgetGuide의 flight + hotel + food + activity + extra 합계가 총 예산을 초과하면 안 됩니다.\n");
        sb.append("- 예산이 적을수록 저가 숙소, 현지 식당, 무료 관광지 위주로 구성하세요.\n");
        sb.append("- 예산이 넉넉하면 리조트, 파인다이닝, 프리미엄 액티비티를 포함하세요.\n");
        sb.append("- 각 activities 항목에 예상 비용을 괄호로 표기하세요. 예: \"스노클링 투어 (1인 5만원)\"\n");
        sb.append("- 예산 초과가 불가피한 경우 warnings에 명시하세요.\n");

        sb.append("\n=== 출력 형식 ===\n");
        sb.append("""
                {
                  "destination": "여행지",
                  "summary": "전체 일정 요약 (예산 및 스타일 반영 여부 포함)",
                  "budgetGuide": {
                    "flight": "항공 예상 비용 (예: 왕복 1인 30만원)",
                    "hotel": "숙소 예상 비용 (예: 총 4박 40만원)",
                    "food": "식비 예상 비용 (예: 1일 평균 2인 5만원)",
                    "activity": "액티비티 예상 비용 (예: 총 15만원)",
                    "extra": "예비비 (예: 5만원)"
                  },
                  "recommendedStay": "추천 숙소 유형 및 구체적 추천 (예산 수준 반영)",
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "YYYY-MM-DD",
                      "title": "하루 일정 제목",
                      "description": "하루 일정 설명",
                      "activities": ["활동1 (예상 비용)", "활동2 (예상 비용)"],
                      "meals": ["아침 추천", "점심 추천", "저녁 추천"],
                      "tips": "해당 날짜 팁"
                    }
                  ],
                  "warnings": ["주의사항 또는 예산 관련 안내"]
                }
                """);

        sb.append("\n위 JSON 형식으로 ").append(totalDays)
                .append("일 전체 일정을 생성해주세요. 여행 조건과 예산 규칙을 반드시 지키세요.");

        return sb.toString();
    }

    public String buildRequestSummary(HoneymoonPlanGenerateRequest request) {
        long totalDays = ChronoUnit.DAYS.between(
                request.getStartDate(), request.getEndDate()) + 1;
        List<String> styles = request.getTravelStyles();
        String styleStr = (styles != null && !styles.isEmpty())
                ? String.join(", ", styles) : "미지정";

        return String.format("%s %d일 / 예산 %s / 스타일 %s",
                request.getDestination(), totalDays,
                request.getBudget(), styleStr);
    }
}