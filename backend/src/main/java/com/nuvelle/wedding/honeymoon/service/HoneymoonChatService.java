package com.nuvelle.wedding.honeymoon.service;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.honeymoon.ai.GeminiClient;
import com.nuvelle.wedding.honeymoon.ai.HoneymoonChatPromptBuilder;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonChatRequest;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonChatResponse;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonPlanResponse;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonChatMessage;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlanDay;
import com.nuvelle.wedding.honeymoon.entity.MessageRole;
import com.nuvelle.wedding.honeymoon.repository.HoneymoonChatMessageRepository;
import com.nuvelle.wedding.honeymoon.repository.HoneymoonPlanDayRepository;
import com.nuvelle.wedding.honeymoon.repository.HoneymoonPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HoneymoonChatService {

    private final HoneymoonPlanRepository planRepository;
    private final HoneymoonPlanDayRepository planDayRepository;
    private final HoneymoonChatMessageRepository chatMessageRepository;
    private final GeminiClient geminiClient;
    private final HoneymoonChatPromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    // 메시지 전송 + AI 응답
    @Transactional
    public HoneymoonChatResponse sendMessage(Long planId,
                                             HoneymoonChatRequest request,
                                             CustomUserDetails userDetails) {
        // 플랜 조회 + 소유권 검증
        HoneymoonPlan plan = planRepository.findByIdWithDays(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        // 사용자 메시지 저장
        HoneymoonChatMessage userMessage = HoneymoonChatMessage.builder()
                .plan(plan)
                .role(MessageRole.USER)
                .content(request.getMessage())
                .build();
        chatMessageRepository.save(userMessage);

        // 최근 10개 대화 내역 조회 (컨텍스트 전달용)
        List<HoneymoonChatMessage> recentMessages =
                chatMessageRepository.findTop10ByPlanIdOrderByCreatedAtDesc(planId);

        // Gemini API 호출
        String prompt = promptBuilder.buildPrompt(plan, recentMessages, request.getMessage());
        String aiResponse = geminiClient.call(prompt);

        log.debug("챗봇 AI 응답: {}", aiResponse);

        // AI 응답 저장
        HoneymoonChatMessage assistantMessage = HoneymoonChatMessage.builder()
                .plan(plan)
                .role(MessageRole.ASSISTANT)
                .content(aiResponse)
                .build();
        chatMessageRepository.save(assistantMessage);

        return HoneymoonChatResponse.from(assistantMessage);
    }

    @Transactional
    public HoneymoonPlanResponse createPlanFromSuggestion(Long planId,
                                                          Long messageId,
                                                          CustomUserDetails userDetails) {
        HoneymoonPlan originalPlan = planRepository.findByIdWithDays(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!originalPlan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        HoneymoonChatMessage suggestion = chatMessageRepository.findByIdAndPlanId(messageId, planId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        if (suggestion.getRole() != MessageRole.ASSISTANT) {
            throw new CustomException(ErrorCode.INVALID_INPUT);
        }

        HoneymoonPlan newPlan = HoneymoonPlan.builder()
                .user(originalPlan.getUser())
                .destination(originalPlan.getDestination())
                .startDate(originalPlan.getStartDate())
                .endDate(originalPlan.getEndDate())
                .budget(originalPlan.getBudget())
                .travelStyle(originalPlan.getTravelStyle())
                .companionStyle(originalPlan.getCompanionStyle())
                .requestSummary("AI 채팅 변경안으로 새로 생성된 일정")
                .aiGeneratedContent(suggestion.getContent())
                .build();

        planRepository.save(newPlan);

        List<HoneymoonPlanDay> parsedDays = parseDaysFromSuggestion(newPlan, suggestion.getContent());

        if (parsedDays.isEmpty()) {
            parsedDays = cloneDays(newPlan, originalPlan.getDays());
        }

        planDayRepository.saveAll(parsedDays);

        return HoneymoonPlanResponse.from(
                planRepository.findByIdWithDays(newPlan.getId()).orElse(newPlan)
        );
    }

    // 대화 내역 조회
    @Transactional(readOnly = true)
    public List<HoneymoonChatResponse> getChatHistory(Long planId,
                                                      CustomUserDetails userDetails) {
        HoneymoonPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLAN_NOT_FOUND));

        if (!plan.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.PLAN_ACCESS_DENIED);
        }

        return chatMessageRepository.findAllByPlanIdOrderByCreatedAtAsc(planId)
                .stream()
                .map(HoneymoonChatResponse::from)
                .collect(Collectors.toList());
    }

    private List<HoneymoonPlanDay> parseDaysFromSuggestion(HoneymoonPlan plan, String content) {
        List<HoneymoonPlanDay> days = new ArrayList<>();
        Pattern dayPattern = Pattern.compile("(?is)(?:^|\\n)\\s*(?:[#*\\s🌴🌺🌊🏖️✈️]*)(?:Day|DAY|day)\\s*(\\d+)\\s*(?:\\((\\d{4}-\\d{2}-\\d{2})\\))?\\s*[:：-]?\\s*([^\\n*]*)");
        Matcher matcher = dayPattern.matcher(content);
        List<DayMatch> matches = new ArrayList<>();

        while (matcher.find()) {
            matches.add(new DayMatch(
                    matcher.start(),
                    matcher.end(),
                    Integer.parseInt(matcher.group(1)),
                    matcher.group(2),
                    cleanupText(matcher.group(3))
            ));
        }

        for (int i = 0; i < matches.size(); i++) {
            DayMatch current = matches.get(i);
            int nextStart = i + 1 < matches.size() ? matches.get(i + 1).start() : content.length();
            String body = content.substring(current.end(), nextStart);
            days.add(buildDay(plan, current, body));
        }

        return days;
    }

    private HoneymoonPlanDay buildDay(HoneymoonPlan plan, DayMatch dayMatch, String body) {
        List<String> activities = new ArrayList<>();
        List<String> meals = new ArrayList<>();
        List<String> descriptions = new ArrayList<>();
        List<String> tips = new ArrayList<>();

        for (String rawLine : body.split("\\R")) {
            String line = cleanupText(rawLine);
            if (line.isBlank() || line.equals("---")) continue;

            if (line.contains("아침") || line.contains("점심")
                    || line.contains("저녁") || line.contains("밤")) {
                meals.add(line);
            } else if (line.contains("오전") || line.contains("오후")) {
                activities.add(line);
            } else if (line.contains("팁") || line.contains("추천")
                    || line.contains("좋습니다") || line.contains("유의")) {
                tips.add(line);
            } else {
                descriptions.add(line);
            }
        }

        if (activities.isEmpty() && !descriptions.isEmpty()) {
            activities.add(descriptions.get(0));
        }

        LocalDate date = null;
        if (dayMatch.date() != null) {
            try {
                date = LocalDate.parse(dayMatch.date());
            } catch (Exception ignored) {
            }
        }

        return HoneymoonPlanDay.builder()
                .plan(plan)
                .dayNumber(dayMatch.dayNumber())
                .date(date)
                .title(dayMatch.title().isBlank()
                        ? "Day " + dayMatch.dayNumber() + " 일정"
                        : dayMatch.title())
                .description(String.join(" ", descriptions))
                .activities(writeJsonArray(activities))
                .meals(writeJsonArray(meals))
                .tips(String.join(" ", tips))
                .build();
    }

    private List<HoneymoonPlanDay> cloneDays(HoneymoonPlan newPlan, List<HoneymoonPlanDay> originalDays) {
        return originalDays.stream()
                .map(day -> HoneymoonPlanDay.builder()
                        .plan(newPlan)
                        .dayNumber(day.getDayNumber())
                        .date(day.getDate())
                        .title(day.getTitle())
                        .description(day.getDescription())
                        .activities(day.getActivities())
                        .meals(day.getMeals())
                        .tips(day.getTips())
                        .build())
                .collect(Collectors.toList());
    }

    private String cleanupText(String text) {
        if (text == null) return "";
        return text
                .replaceAll("[*_`#]", "")
                .replaceAll("^[-•\\s]+", "")
                .trim();
    }

    private String writeJsonArray(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values);
        } catch (Exception e) {
            return "[]";
        }
    }

    private record DayMatch(int start, int end, int dayNumber, String date, String title) {
    }
}
