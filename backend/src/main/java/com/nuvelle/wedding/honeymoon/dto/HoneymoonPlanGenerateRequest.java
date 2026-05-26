package com.nuvelle.wedding.honeymoon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class HoneymoonPlanGenerateRequest {

    @NotBlank(message = "여행지를 입력해주세요.")
    private String destination;

    @NotNull(message = "출발일을 입력해주세요.")
    private LocalDate startDate;

    @NotNull(message = "도착일을 입력해주세요.")
    private LocalDate endDate;

    @NotBlank(message = "예산을 입력해주세요.")
    private String budget;

    private List<String> travelStyles;

    private String companionStyle;

    private String mustInclude;

    private String mustExclude;
}