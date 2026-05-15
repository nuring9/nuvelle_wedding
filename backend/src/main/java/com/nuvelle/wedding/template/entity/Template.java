package com.nuvelle.wedding.template.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // 템플릿을 URL이나 식별값으로 사용할 수 있는 고유 문자열
    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "preview_image_url")
    private String previewImageUrl;

    @Column(name = "theme_key", length = 50)
    private String themeKey;

    @Column(name = "layout_key", length = 50)
    private String layoutKey;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public Template(String name, String slug, String thumbnailUrl, String previewImageUrl, String themeKey, String layoutKey, boolean isActive, int sortOrder){
        this.name = name;
        this.slug = slug;
        this.thumbnailUrl = thumbnailUrl;
        this.previewImageUrl = previewImageUrl;
        this.themeKey = themeKey;
        this.layoutKey = layoutKey;
        this.isActive = isActive;
        this.sortOrder = sortOrder;
    }
}
