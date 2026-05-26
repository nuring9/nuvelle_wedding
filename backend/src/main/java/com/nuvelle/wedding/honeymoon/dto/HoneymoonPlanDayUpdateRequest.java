package com.nuvelle.wedding.honeymoon.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class HoneymoonPlanDayUpdateRequest {

    private String title;
    private String description;
    private List<String> activities;
    private List<String> meals;
    private String tips;
}