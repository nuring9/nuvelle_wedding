package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class InvitationSummaryResponse {
    private Long id;
    private String templateName;
    private String slug;
    private InvitationStatus status;
    private String title;
    private String mainImageUrl;
    private String groomName;
    private String brideName;
    private LocalDate weddingDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static InvitationSummaryResponse from(Invitation invitation) {
        return InvitationSummaryResponse.builder()
                .id(invitation.getId())
                .templateName(invitation.getTemplate().getName())
                .slug(invitation.getSlug())
                .status(invitation.getStatus())
                .title(invitation.getTitle())
                .mainImageUrl(invitation.getMainImageUrl())
                .groomName(invitation.getGroomName())
                .brideName(invitation.getBrideName())
                .weddingDate(invitation.getWeddingDate())
                .createdAt(invitation.getCreatedAt())
                .updatedAt(invitation.getUpdatedAt())
                .build();
    }
}
