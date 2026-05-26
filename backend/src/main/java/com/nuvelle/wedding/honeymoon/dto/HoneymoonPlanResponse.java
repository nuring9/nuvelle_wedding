package com.nuvelle.wedding.honeymoon.dto;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import com.nuvelle.wedding.honeymoon.entity.PlanStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class HoneymoonPlanResponse {

    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String budget;
    private String travelStyle;
    private String companionStyle;
    private String requestSummary;
    private String aiGeneratedContent;
    private PlanStatus status;
    private List<HoneymoonPlanDayResponse> days;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static HoneymoonPlanResponse from(HoneymoonPlan plan) {
        return HoneymoonPlanResponse.builder()
                .id(plan.getId())
                .destination(plan.getDestination())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .budget(plan.getBudget())
                .travelStyle(plan.getTravelStyle())
                .companionStyle(plan.getCompanionStyle())
                .requestSummary(plan.getRequestSummary())
                .aiGeneratedContent(plan.getAiGeneratedContent())
                .status(plan.getStatus())
                .days(plan.getDays().stream()
                        .map(HoneymoonPlanDayResponse::from)
                        .collect(Collectors.toList()))
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}