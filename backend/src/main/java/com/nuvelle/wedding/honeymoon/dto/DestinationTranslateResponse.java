package com.nuvelle.wedding.honeymoon.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DestinationTranslateResponse {

    private String query;

    public static DestinationTranslateResponse of(String query) {
        return DestinationTranslateResponse.builder()
                .query(query)
                .build();
    }
}
