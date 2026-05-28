package com.nuvelle.wedding.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserWithdrawRequest {

    @NotBlank(message = "탈퇴 확인 문구를 입력해주세요.")
    private String confirmText;
}
