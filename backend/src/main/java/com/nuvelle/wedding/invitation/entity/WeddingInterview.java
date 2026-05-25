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

    @Column(name = "question6", length = 200)
    private String question6;

    @Column(name = "answer6", columnDefinition = "TEXT")
    private String answer6;

    @Column(name = "question7", length = 200)
    private String question7;

    @Column(name = "answer7", columnDefinition = "TEXT")
    private String answer7;

    @Column(name = "question8", length = 200)
    private String question8;

    @Column(name = "answer8", columnDefinition = "TEXT")
    private String answer8;

    @Column(name = "question9", length = 200)
    private String question9;

    @Column(name = "answer9", columnDefinition = "TEXT")
    private String answer9;

    @Column(name = "question10", length = 200)
    private String question10;

    @Column(name = "answer10", columnDefinition = "TEXT")
    private String answer10;

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
                            String question5, String answer5,
                            String question6, String answer6,
                            String question7, String answer7,
                            String question8, String answer8,
                            String question9, String answer9,
                            String question10, String answer10) {
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
        this.question6 = question6;
        this.answer6 = answer6;
        this.question7 = question7;
        this.answer7 = answer7;
        this.question8 = question8;
        this.answer8 = answer8;
        this.question9 = question9;
        this.answer9 = answer9;
        this.question10 = question10;
        this.answer10 = answer10;
    }

    public void update(String question1, String answer1,
                       String question2, String answer2,
                       String question3, String answer3,
                       String question4, String answer4,
                       String question5, String answer5,
                       String question6, String answer6,
                       String question7, String answer7,
                       String question8, String answer8,
                       String question9, String answer9,
                       String question10, String answer10) {
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
        this.question6 = question6;
        this.answer6 = answer6;
        this.question7 = question7;
        this.answer7 = answer7;
        this.question8 = question8;
        this.answer8 = answer8;
        this.question9 = question9;
        this.answer9 = answer9;
        this.question10 = question10;
        this.answer10 = answer10;
    }
}
