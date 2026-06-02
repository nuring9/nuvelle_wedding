package com.nuvelle.wedding.template.dto;

import com.nuvelle.wedding.template.entity.Template;
import com.nuvelle.wedding.invitation.dto.PublicInvitationResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TemplateResponse {

    private Long id;
    private String name;
    private String slug;
    private String thumbnailUrl;
    private String previewImageUrl;
    private String themeKey;
    private String layoutKey;
    private String description;
    private int sortOrder;
    private PublicInvitationResponse masterInvitation;
    private LocalDateTime createdAt;

    public static TemplateResponse from(Template template) {
        return TemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .slug(template.getSlug())
                .thumbnailUrl(template.getThumbnailUrl())
                .previewImageUrl(template.getPreviewImageUrl())
                .themeKey(template.getThemeKey())
                .layoutKey(template.getLayoutKey())
                .description(template.getDescription())
                .sortOrder(template.getSortOrder())
                .masterInvitation(template.getMasterInvitation() != null
                        ? PublicInvitationResponse.from(template.getMasterInvitation())
                        : null)
                .createdAt(template.getCreatedAt())
                .build();
    }
}
