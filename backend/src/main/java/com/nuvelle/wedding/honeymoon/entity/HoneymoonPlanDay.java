package com.nuvelle.wedding.honeymoon.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "honeymoon_plan_days")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HoneymoonPlanDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private HoneymoonPlan plan;

    @Column(name = "day_number", nullable = false)
    private int dayNumber;

    private LocalDate date;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // JSON 배열 형태로 저장 ex) ["스노클링", "해변 산책"]
    @Column(columnDefinition = "TEXT")
    private String activities;

    // JSON 배열 형태로 저장 ex) ["리조트 디너", "현지 해산물"]
    @Column(columnDefinition = "TEXT")
    private String meals;

    @Column(columnDefinition = "TEXT")
    private String tips;

    @Builder
    public HoneymoonPlanDay(HoneymoonPlan plan, int dayNumber, LocalDate date,
                            String title, String description,
                            String activities, String meals, String tips) {
        this.plan = plan;
        this.dayNumber = dayNumber;
        this.date = date;
        this.title = title;
        this.description = description;
        this.activities = activities;
        this.meals = meals;
        this.tips = tips;
    }

    public void update(String title, String description,
                       String activities, String meals, String tips) {
        this.title = title;
        this.description = description;
        this.activities = activities;
        this.meals = meals;
        this.tips = tips;
    }
}