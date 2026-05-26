package com.nuvelle.wedding.honeymoon.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.honeymoon.ai.GeminiClient;
import com.nuvelle.wedding.honeymoon.ai.HoneymoonPromptBuilder;
import com.nuvelle.wedding.honeymoon.dto.*;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlanDay;
import com.nuvelle.wedding.honeymoon.repository.HoneymoonPlanDayRepository;
import com.nuvelle.wedding.honeymoon.repository.HoneymoonPlanRepository;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HoneymoonPlanService {

    private final HoneymoonPlanRepository planRepository;
    private final HoneymoonPlanDayRepository planDayRepository;
    private final UserRepository userRepository;
    private final GeminiClient geminiClient;
    private final HoneymoonPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    // AI 일정 생성
    @Transactional
    public HoneymoonPlanResponse generate(HoneymoonPlanGenerateRequest request,
                                          CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // Gemini API 호출
        String prompt = promptBuilder.buildPrompt(request);
        String aiResponse = geminiClient.call(prompt);

        log.debug("Gemini AI 응답: {}", aiResponse);

        // 플랜 저장
        String travelStyle = request.getTravelStyles() != null
                ? String.join(", ", request.getTravelStyles()) : "";

        HoneymoonPlan plan = HoneymoonPlan.builder()
                .user(user)
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .travelStyle(travelStyle)
                .companionStyle(request.getCompanionStyle())
                .requestSummary(promptBuilder.buildRequestSummary(request))
                .aiGeneratedContent(aiResponse)
                .build();

        planRepository.save(plan);

        // AI 응답 파싱 후 Day별 저장
        try {
            parseAndSaveDays(plan, aiResponse);
        } catch (Exception e) {
            log.warn("AI 응답 파싱 실패. 원본 저장 후 진행합니다. 오류: {}", e.getMessage());
        }

        return HoneymoonPlanResponse.from(
                planRepository.findByIdWithDays(plan.getId()).orElse(plan)
        );
    }

    // AI 응답 파싱 후 Day별 저장
    private void parseAndSaveDays(HoneymoonPlan plan, String aiResponse) throws Exception {
        String jsonStr = extractJson(aiResponse);
        JsonNode root = objectMapper.readTree(jsonStr);
        JsonNode daysNode = root.get("days");

        if (daysNode == null || !daysNode.isArray()) return;

        for (JsonNode dayNode : daysNode) {
            int dayNumber = dayNode.get("dayNumber").asInt();

            LocalDate date = null;
            if (dayNode.has("date") && !dayNode.get("date").isNull()) {
                try {
                    date = LocalDate.parse(dayNode.get("date").asText());
                } catch (Exception ignored) {}
            }

            String activities = objectMapper.writeValueAsString(
                    dayNode.has("activities")
                            ? dayNode.get("activities")
                            : objectMapper.createArrayNode()
            );
            String meals = objectMapper.writeValueAsString(
                    dayNode.has("meals")
                            ? dayNode.get("meals")
                            : objectMapper.createArrayNode()
            );

            HoneymoonPlanDay day = HoneymoonPlanDay.builder()
                    .plan(plan)
                    .dayNumber(dayNumber)
                    .date(date)
                    .title(dayNode.has("title") ? dayNode.get("title").asText() : "")
                    .description(dayNode.has("description")
                            ? dayNode.get("description").asText() : "")
                    .activities(activities)
                    .meals(meals)
                    .tips(dayNode.has("tips") ? dayNode.get("tips").asText() : "")
                    .build();

            planDayRepository.save(day);
        }
    }

    // AI 응답에서 JSON 부분만 추출
    private String extractJson(String text) {
        if (text.contains("```json")) {
            int start = text.indexOf("```json") + 7;
            int end = text.lastIndexOf("```");
            if (end > start) return text.substring(start, end).trim();
        }
        if (text.contains("```")) {
            int start = text.indexOf("```") + 3;
            int end = text.lastIndexOf("```");
            if (end > start) return text.substring(start, end).trim();
        }
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start >= 0 && end > start) return text.substring(start, end + 1);

        return text.trim();
    }

    // 내 플랜 목록 조회
    @Transactional(readOnly = true)
    public List<HoneymoonPlanSummaryResponse> getMyPlans(CustomUserDetails userDetails) {
        return planRepository.findAllByUserIdOrderByCreatedAtDesc(userDetails.getUserId())
                .stream()
                .map(HoneymoonPlanSummaryResponse::from)
                .collect(Collectors.toList());
    }

    // 플랜 상세 조회
    @Transactional(readOnly = true)
    public HoneymoonPlanResponse getPlan(Long planId, CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findByIdWithDays(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        return HoneymoonPlanResponse.from(plan);
    }

    // 플랜 수정
    @Transactional
    public HoneymoonPlanResponse updatePlan(Long planId,
                                            HoneymoonPlanUpdateRequest request,
                                            CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findByIdWithDays(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        String travelStyle = request.getTravelStyles() != null
                ? String.join(", ", request.getTravelStyles())
                : plan.getTravelStyle();

        plan.update(
                request.getDestination() != null
                        ? request.getDestination() : plan.getDestination(),
                request.getStartDate() != null
                        ? request.getStartDate() : plan.getStartDate(),
                request.getEndDate() != null
                        ? request.getEndDate() : plan.getEndDate(),
                request.getBudget() != null
                        ? request.getBudget() : plan.getBudget(),
                travelStyle,
                request.getCompanionStyle() != null
                        ? request.getCompanionStyle() : plan.getCompanionStyle()
        );

        return HoneymoonPlanResponse.from(plan);
    }

    // 플랜 저장 (DRAFT → SAVED)
    @Transactional
    public HoneymoonPlanResponse savePlan(Long planId, CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findByIdWithDays(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        plan.save();

        return HoneymoonPlanResponse.from(plan);
    }

    // 플랜 삭제
    @Transactional
    public void deletePlan(Long planId, CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        planRepository.delete(plan);
    }

    // Day별 일정 수정
    @Transactional
    public HoneymoonPlanDayResponse updateDay(Long planId, Long dayId,
                                              HoneymoonPlanDayUpdateRequest request,
                                              CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        HoneymoonPlanDay day = planDayRepository.findByIdAndPlanId(dayId, planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        try {
            String activities = request.getActivities() != null
                    ? objectMapper.writeValueAsString(request.getActivities())
                    : day.getActivities();
            String meals = request.getMeals() != null
                    ? objectMapper.writeValueAsString(request.getMeals())
                    : day.getMeals();

            day.update(
                    request.getTitle() != null ? request.getTitle() : day.getTitle(),
                    request.getDescription() != null
                            ? request.getDescription() : day.getDescription(),
                    activities,
                    meals,
                    request.getTips() != null ? request.getTips() : day.getTips()
            );
        } catch (Exception e) {
            throw new RuntimeException("Day 일정 수정 중 오류가 발생했습니다.");
        }

        return HoneymoonPlanDayResponse.from(day);
    }
}