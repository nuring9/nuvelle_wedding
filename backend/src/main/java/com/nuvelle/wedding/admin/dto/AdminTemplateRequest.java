package com.nuvelle.wedding.admin.dto;

import lombok.Getter;

@Getter
public class AdminTemplateRequest {
    private String name;
    private String thumbnailUrl;
    private String previewImageUrl;
    private String themeKey;
    private String layoutKey;
    private String description;
    private Boolean active;
    private Integer sortOrder;
}