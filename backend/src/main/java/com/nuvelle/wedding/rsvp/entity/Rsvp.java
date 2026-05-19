package com.nuvelle.wedding.rsvp.entity;

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
@Table(name = "rsvps")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private Invitation invitation;

    @Column(name = "guest_name", nullable = false, length = 50)
    private String guestName;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_status", nullable = false, length = 20)
    private AttendanceStatus attendanceStatus;

    @Column(name = "guest_count", nullable = false)
    private int guestCount;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "phone", length = 20)
    private String phone;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Rsvp(Invitation invitation, String guestName, AttendanceStatus attendanceStatus, int guestCount,
                String message, String phone) {
        this.invitation = invitation;
        this.guestName = guestName;
        this.attendanceStatus = attendanceStatus;
        this.guestCount = guestCount;
        this.message = message;
        this.phone = phone;
    }

}
