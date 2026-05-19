package com.nuvelle.wedding.guestbook.entity;

import com.nuvelle.wedding.invitation.entity.Invitation;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "guestbooks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Guestbook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private Invitation invitation;

    @Column(name = "guest_name", nullable = false, length = 50)
    private String guestName;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_hidden", nullable = false)
    private boolean isHidden;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Guestbook(Invitation invitation, String guestName,
                     String message, boolean isHidden) {
        this.invitation = invitation;
        this.guestName = guestName;
        this.message = message;
        this.isHidden = isHidden;
    }

    public void hide() {
        this.isHidden = true;
    }

    public void show() {
        this.isHidden = false;
    }
}