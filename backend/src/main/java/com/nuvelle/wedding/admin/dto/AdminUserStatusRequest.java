package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminUserStatusRequest {

    @NotNull(message = "변경할 회원 상태를 선택해주세요.")
    private UserStatus status;
}
