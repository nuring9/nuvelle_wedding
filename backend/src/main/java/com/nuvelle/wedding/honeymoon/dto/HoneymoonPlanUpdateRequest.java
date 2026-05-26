package com.nuvelle.wedding.honeymoon.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class HoneymoonPlanUpdateRequest {

    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String budget;
    private List<String> travelStyles;
    private String companionStyle;
}