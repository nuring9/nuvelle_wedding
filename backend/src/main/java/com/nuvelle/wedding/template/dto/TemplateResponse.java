package com.nuvelle.wedding.template.dto;

import com.nuvelle.wedding.template.entity.Template;
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
    private int sortOrder;
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
                .sortOrder(template.getSortOrder())
                .createdAt(template.getCreatedAt())
                .build();
    }
}
