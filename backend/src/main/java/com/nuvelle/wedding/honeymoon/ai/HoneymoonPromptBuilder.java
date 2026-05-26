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
        sb.append("아래 조건에 맞는 신혼여행 일정을 JSON 형식으로만 생성해주세요.\n");
        sb.append("JSON 외 다른 텍스트나 설명은 절대 포함하지 마세요.\n\n");

        sb.append("=== 여행 조건 ===\n");
        sb.append("여행지: ").append(request.getDestination()).append("\n");
        sb.append("출발일: ").append(request.getStartDate()).append("\n");
        sb.append("도착일: ").append(request.getEndDate()).append("\n");
        sb.append("총 여행 기간: ").append(totalDays).append("일\n");
        sb.append("예산: ").append(request.getBudget()).append("\n");

        List<String> styles = request.getTravelStyles();
        if (styles != null && !styles.isEmpty()) {
            sb.append("여행 스타일: ").append(String.join(", ", styles)).append("\n");
        }

        if (request.getCompanionStyle() != null
                && !request.getCompanionStyle().isBlank()) {
            sb.append("동반자 특성: ").append(request.getCompanionStyle()).append("\n");
        }

        if (request.getMustInclude() != null
                && !request.getMustInclude().isBlank()) {
            sb.append("꼭 포함할 것: ").append(request.getMustInclude()).append("\n");
        }

        if (request.getMustExclude() != null
                && !request.getMustExclude().isBlank()) {
            sb.append("제외할 것: ").append(request.getMustExclude()).append("\n");
        }

        sb.append("\n=== 출력 형식 ===\n");
        sb.append("""
                {
                  "destination": "여행지",
                  "summary": "전체 일정 요약",
                  "budgetGuide": {
                    "flight": "항공 예상 비용",
                    "hotel": "숙소 예상 비용",
                    "food": "식비 예상 비용",
                    "activity": "액티비티 예상 비용",
                    "extra": "예비비"
                  },
                  "recommendedStay": "추천 숙소 유형",
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "YYYY-MM-DD",
                      "title": "하루 일정 제목",
                      "description": "하루 일정 설명",
                      "activities": ["활동1", "활동2"],
                      "meals": ["아침 추천", "점심 추천", "저녁 추천"],
                      "tips": "해당 날짜 팁"
                    }
                  ],
                  "warnings": ["주의사항1", "주의사항2"]
                }
                """);

        sb.append("\n위 JSON 형식으로 ").append(totalDays)
                .append("일 전체 일정을 생성해주세요.");

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