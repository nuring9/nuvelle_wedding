package com.nuvelle.wedding.invitation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "wedding_interviews")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class WeddingInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false, unique = true)
    private Invitation invitation;

    @Column(name = "question1", length = 200)
    private String question1;

    @Column(name = "answer1", columnDefinition = "TEXT")
    private String answer1;

    @Column(name = "question2", length = 200)
    private String question2;

    @Column(name = "answer2", columnDefinition = "TEXT")
    private String answer2;

    @Column(name = "question3", length = 200)
    private String question3;

    @Column(name = "answer3", columnDefinition = "TEXT")
    private String answer3;

    @Column(name = "question4", length = 200)
    private String question4;

    @Column(name = "answer4", columnDefinition = "TEXT")
    private String answer4;

    @Column(name = "question5", length = 200)
    private String question5;

    @Column(name = "answer5", columnDefinition = "TEXT")
    private String answer5;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public WeddingInterview(Invitation invitation,
                            String question1, String answer1,
                            String question2, String answer2,
                            String question3, String answer3,
                            String question4, String answer4,
                            String question5, String answer5) {
        this.invitation = invitation;
        this.question1 = question1;
        this.answer1 = answer1;
        this.question2 = question2;
        this.answer2 = answer2;
        this.question3 = question3;
        this.answer3 = answer3;
        this.question4 = question4;
        this.answer4 = answer4;
        this.question5 = question5;
        this.answer5 = answer5;
    }

    public void update(String question1, String answer1,
                       String question2, String answer2,
                       String question3, String answer3,
                       String question4, String answer4,
                       String question5, String answer5) {
        this.question1 = question1;
        this.answer1 = answer1;
        this.question2 = question2;
        this.answer2 = answer2;
        this.question3 = question3;
        this.answer3 = answer3;
        this.question4 = question4;
        this.answer4 = answer4;
        this.question5 = question5;
        this.answer5 = answer5;
    }
}