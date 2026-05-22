package com.nuvelle.wedding.bgm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "bgms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Bgm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(length = 50)
    private String mood;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Bgm(String title, String fileUrl, String mood,
               boolean isActive, int sortOrder) {
        this.title = title;
        this.fileUrl = fileUrl;
        this.mood = mood;
        this.isActive = isActive;
        this.sortOrder = sortOrder;
    }
}