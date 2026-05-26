package com.nuvelle.wedding.honeymoon.dto;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlanDay;
import lombok.Builder;
import lombok.Getter;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Getter
@Builder
public class HoneymoonPlanDayResponse {

    private Long id;
    private int dayNumber;
    private LocalDate date;
    private String title;
    private String description;
    private List<String> activities;
    private List<String> meals;
    private String tips;

    public static HoneymoonPlanDayResponse from(HoneymoonPlanDay day) {
        ObjectMapper mapper = new ObjectMapper();

        return HoneymoonPlanDayResponse.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .title(day.getTitle())
                .description(day.getDescription())
                .activities(parseList(mapper, day.getActivities()))
                .meals(parseList(mapper, day.getMeals()))
                .tips(day.getTips())
                .build();
    }

    private static List<String> parseList(ObjectMapper mapper, String json) {
        if (json == null || json.isBlank()) return Collections.emptyList(); // 빈 List를 반환한다.
        try {
            return mapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}