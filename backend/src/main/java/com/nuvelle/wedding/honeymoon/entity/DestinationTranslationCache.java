package com.nuvelle.wedding.honeymoon.entity;

import com.nuvelle.wedding.user.entity.User;
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
@Table(
        name = "destination_translation_caches",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "source_text"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class DestinationTranslationCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "source_text", nullable = false, length = 100)
    private String sourceText;

    @Column(name = "english_query", nullable = false, length = 200)
    private String englishQuery;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public DestinationTranslationCache(User user, String sourceText, String englishQuery) {
        this.user = user;
        this.sourceText = sourceText;
        this.englishQuery = englishQuery;
    }
}
