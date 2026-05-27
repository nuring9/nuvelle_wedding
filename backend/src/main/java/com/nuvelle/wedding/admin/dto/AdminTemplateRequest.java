package com.nuvelle.wedding.admin.dto;

import lombok.Getter;

@Getter
public class AdminTemplateRequest {
    private String name;
    private String slug;
    private String thumbnailUrl;
    private String previewImageUrl;
    private String themeKey;
    private String layoutKey;
    private Boolean active;
    private Integer sortOrder;
}