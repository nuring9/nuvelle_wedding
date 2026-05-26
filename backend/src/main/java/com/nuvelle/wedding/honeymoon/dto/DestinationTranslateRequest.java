package com.nuvelle.wedding.honeymoon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class DestinationTranslateRequest {

    @NotBlank(message = "여행지를 입력해주세요.")
    private String destination;
}
