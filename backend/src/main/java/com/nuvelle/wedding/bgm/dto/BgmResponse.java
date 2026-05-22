package com.nuvelle.wedding.bgm.dto;

import com.nuvelle.wedding.bgm.entity.Bgm;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BgmResponse {

    private Long id;
    private String title;
    private String fileUrl;
    private String mood;
    private int sortOrder;

    public static BgmResponse from(Bgm bgm) {
        return BgmResponse.builder()
                .id(bgm.getId())
                .title(bgm.getTitle())
                .fileUrl(bgm.getFileUrl())
                .mood(bgm.getMood())
                .sortOrder(bgm.getSortOrder())
                .build();
    }
}