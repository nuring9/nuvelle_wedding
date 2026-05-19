package com.nuvelle.wedding.rsvp.dto;

import com.nuvelle.wedding.rsvp.entity.AttendanceStatus;
import com.nuvelle.wedding.rsvp.entity.Rsvp;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RsvpResponse {

    private Long id;
    private String guestName;
    private AttendanceStatus attendanceStatus;
    private int guestCount;
    private String message;
    private String phone;
    private LocalDateTime createdAt;

    public static RsvpResponse from(Rsvp rsvp) {
        return RsvpResponse.builder()
                .id(rsvp.getId())
                .guestName(rsvp.getGuestName())
                .attendanceStatus(rsvp.getAttendanceStatus())
                .guestCount(rsvp.getGuestCount())
                .message(rsvp.getMessage())
                .phone(rsvp.getPhone())
                .createdAt(rsvp.getCreatedAt())
                .build();
    }
}