package com.nuvelle.wedding.honeymoon.dto;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import com.nuvelle.wedding.honeymoon.entity.PlanStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class HoneymoonPlanSummaryResponse {

    private Long id;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String budget;
    private String travelStyle;
    private PlanStatus status;
    private int totalDays;
    private LocalDateTime createdAt;

    public static HoneymoonPlanSummaryResponse from(HoneymoonPlan plan) {
        return HoneymoonPlanSummaryResponse.builder()
                .id(plan.getId())
                .destination(plan.getDestination())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .budget(plan.getBudget())
                .travelStyle(plan.getTravelStyle())
                .status(plan.getStatus())
                .totalDays(plan.getDays().size())
                .createdAt(plan.getCreatedAt())
                .build();
    }
}