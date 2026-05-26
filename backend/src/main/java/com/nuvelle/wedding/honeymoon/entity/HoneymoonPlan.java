package com.nuvelle.wedding.honeymoon.entity;

import com.nuvelle.wedding.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "honeymoon_plans")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class HoneymoonPlan {

    // 신혼여행 계획 고유 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 이 신혼여행 계획을 만든 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 여행지
    @Column(nullable = false, length = 100)
    private String destination;

    // 여행 시작일
    @Column(name = "start_date")
    private LocalDate startDate;

    // 여행 종료일
    @Column(name = "end_date")
    private LocalDate endDate;

    // 여행 예산
    @Column(length = 100)
    private String budget;

    // 여행 스타일
    @Column(name = "travel_style", length = 200)
    private String travelStyle;

    // 동반자 특성
    @Column(name = "companion_style", columnDefinition = "TEXT")
    private String companionStyle;

    // 사용자가 요청한 조건 요약
    @Column(name = "request_summary", columnDefinition = "TEXT")
    private String requestSummary;

    // AI가 생성한 신혼여행 일정 원본 내용
    @Column(name = "ai_generated_content", columnDefinition = "LONGTEXT")
    private String aiGeneratedContent;

    // 신혼여행 계획 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanStatus status = PlanStatus.DRAFT;

    // 신혼여행 일자별 상세 일정 목록
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dayNumber ASC")
    private List<HoneymoonPlanDay> days = new ArrayList<>();

    // 신혼여행 계획 생성 시간
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 신혼여행 계획 마지막 수정 시간
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public HoneymoonPlan(User user, String destination, LocalDate startDate,
                         LocalDate endDate, String budget, String travelStyle,
                         String companionStyle, String requestSummary,
                         String aiGeneratedContent) {
        this.user = user;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.travelStyle = travelStyle;
        this.companionStyle = companionStyle;
        this.requestSummary = requestSummary;
        this.aiGeneratedContent = aiGeneratedContent;
        this.status = PlanStatus.DRAFT;
    }

    public void update(String destination, LocalDate startDate, LocalDate endDate,
                       String budget, String travelStyle, String companionStyle) {
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.travelStyle = travelStyle;
        this.companionStyle = companionStyle;
    }

    public void save() {
        this.status = PlanStatus.SAVED;
    }

    public boolean isOwnedBy(Long userId) {
        return this.user.getId().equals(userId);
    }
}