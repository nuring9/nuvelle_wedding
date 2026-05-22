package com.nuvelle.wedding.guestphoto.entity;

import com.nuvelle.wedding.invitation.entity.Invitation;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "guest_photos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class GuestPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private Invitation invitation;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "uploader_name", length = 50)
    private String uploaderName;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public GuestPhoto(Invitation invitation, String imageUrl,
                      String uploaderName, String message) {
        this.invitation = invitation;
        this.imageUrl = imageUrl;
        this.uploaderName = uploaderName;
        this.message = message;
    }
}
