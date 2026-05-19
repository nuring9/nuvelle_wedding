package com.nuvelle.wedding.guestbook.dto;

import com.nuvelle.wedding.guestbook.entity.Guestbook;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GuestbookResponse {

    private Long id;
    private String guestName;
    private String message;
    private boolean isHidden;
    private LocalDateTime createdAt;

    public static GuestbookResponse from(Guestbook guestbook) {
        return GuestbookResponse.builder()
                .id(guestbook.getId())
                .guestName(guestbook.getGuestName())
                .message(guestbook.getMessage())
                .isHidden(guestbook.isHidden())
                .createdAt(guestbook.getCreatedAt())
                .build();
    }
}