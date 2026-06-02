package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.template.entity.Template;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminTemplateResponse {
    private Long id;
    private String name;
    private String slug;
    private String thumbnailUrl;
    private String previewImageUrl;
    private String themeKey;
    private String layoutKey;
    private String description;
    private boolean active;
    private int sortOrder;
    private Long masterInvitationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminTemplateResponse from(Template template) {
        return AdminTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .slug(template.getSlug())
                .thumbnailUrl(template.getThumbnailUrl())
                .previewImageUrl(template.getPreviewImageUrl())
                .themeKey(template.getThemeKey())
                .layoutKey(template.getLayoutKey())
                .description(template.getDescription())
                .active(template.isActive())
                .sortOrder(template.getSortOrder())
                .masterInvitationId(template.getMasterInvitation() != null
                        ? template.getMasterInvitation().getId()
                        : null)
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}