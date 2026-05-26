package com.nuvelle.wedding.honeymoon.ai;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonChatMessage;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlanDay;
import com.nuvelle.wedding.honeymoon.entity.MessageRole;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class HoneymoonChatPromptBuilder {

    public String buildPrompt(HoneymoonPlan plan,
                              List<HoneymoonChatMessage> recentMessages,
                              String userMessage) {
        StringBuilder sb = new StringBuilder();

        sb.append("당신은 신혼여행 전문 플래너 AI입니다.\n");
        sb.append("아래 신혼여행 일정을 기반으로 사용자의 질문에 친절하게 답변해주세요.\n\n");

        // 현재 여행 계획 요약 전달
        sb.append("=== 현재 신혼여행 계획 ===\n");
        sb.append("여행지: ").append(plan.getDestination()).append("\n");
        sb.append("기간: ").append(plan.getStartDate())
                .append(" ~ ").append(plan.getEndDate()).append("\n");
        sb.append("예산: ").append(plan.getBudget()).append("\n");

        if (plan.getTravelStyle() != null && !plan.getTravelStyle().isBlank()) {
            sb.append("여행 스타일: ").append(plan.getTravelStyle()).append("\n");
        }

        // Day별 일정 요약
        List<HoneymoonPlanDay> days = plan.getDays();

        if (!days.isEmpty()) {
            sb.append("\n=== 일정 요약 ===\n");

            for (HoneymoonPlanDay day : days) {
                sb.append("Day ").append(day.getDayNumber());
                sb.append(": ").append(day.getTitle());

                if (day.getDescription() != null && !day.getDescription().isBlank()) {
                    // 설명은 최대 50자만 포함
                    String desc = day.getDescription();

                    if (desc.length() > 50) {
                        desc = desc.substring(0, 50) + "...";
                    }

                    sb.append(" - ").append(desc);
                }

                sb.append("\n");
            }
        }

        // 최근 대화 내역 포함
        List<HoneymoonChatMessage> reversed = new java.util.ArrayList<>(recentMessages);
        Collections.reverse(reversed);  // AI에게 대화 흐름을 자연스럽게 알려주려면 오래된 대화부터 보여주는 것이 좋다.

        if (!reversed.isEmpty()) {
            sb.append("\n=== 최근 대화 내역 ===\n");

            for (HoneymoonChatMessage msg : reversed) {
                String roleLabel = msg.getRole() == MessageRole.USER ? "사용자" : "AI";
                sb.append(roleLabel).append(": ").append(msg.getContent()).append("\n");
            }
        }

        sb.append("\n=== 사용자 질문 ===\n");
        sb.append(userMessage);

        return sb.toString();
    }
}