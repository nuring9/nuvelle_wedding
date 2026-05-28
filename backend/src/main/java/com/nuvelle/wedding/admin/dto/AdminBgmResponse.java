package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.bgm.entity.Bgm;
import lombok.Builder;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminBgmResponse {

    private Long id;
    private String title;
    private String fileUrl;
    private String mood;

    @JsonProperty("isActive")
    private boolean isActive;

    private int sortOrder;
    private LocalDateTime createdAt;

    public static AdminBgmResponse from(Bgm bgm) {
        return AdminBgmResponse.builder()
                .id(bgm.getId())
                .title(bgm.getTitle())
                .fileUrl(bgm.getFileUrl())
                .mood(bgm.getMood())
                .isActive(bgm.isActive())
                .sortOrder(bgm.getSortOrder())
                .createdAt(bgm.getCreatedAt())
                .build();
    }
}
