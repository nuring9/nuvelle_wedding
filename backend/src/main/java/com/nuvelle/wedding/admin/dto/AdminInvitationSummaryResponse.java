package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class AdminInvitationSummaryResponse {
    private Long invitationId;
    private String title;
    private String slug;
    private String publicUrl;
    private InvitationStatus status;
    private LocalDateTime publishedAt;
    private String groomName;
    private String brideName;
    private LocalDate weddingDate;
    private String venueName;
    private Long userId;
    private String userName;
    private String userEmail;
    private String templateName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminInvitationSummaryResponse from(Invitation invitation, String baseUrl) {
        return AdminInvitationSummaryResponse.builder()
                .invitationId(invitation.getId())
                .title(invitation.getTitle())
                .slug(invitation.getSlug())
                .publicUrl(baseUrl + "/invite/" + invitation.getSlug())
                .status(invitation.getStatus())
                .publishedAt(invitation.getPublishedAt())
                .groomName(invitation.getGroomName())
                .brideName(invitation.getBrideName())
                .weddingDate(invitation.getWeddingDate())
                .venueName(invitation.getVenueName())
                .userId(invitation.getUser().getId())
                .userName(invitation.getUser().getName())
                .userEmail(invitation.getUser().getEmail())
                .templateName(invitation.getTemplate().getName())
                .createdAt(invitation.getCreatedAt())
                .updatedAt(invitation.getUpdatedAt())
                .build();
    }
}