package com.nuvelle.wedding.guestbook.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class GuestbookRequest {

    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 50, message = "이름은 50자 이하여야 합니다.")
    private String guestName;

    @NotBlank(message = "메시지는 필수입니다.")
    private String message;
}