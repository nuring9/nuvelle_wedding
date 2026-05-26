package com.nuvelle.wedding.honeymoon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class HoneymoonChatRequest {

    @NotBlank(message = "메세지를 입력해주세요.")
    private String message;
}
