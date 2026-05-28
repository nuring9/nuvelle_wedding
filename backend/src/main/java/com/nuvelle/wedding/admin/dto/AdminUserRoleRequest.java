package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.user.entity.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AdminUserRoleRequest {

    @NotNull(message = "변경할 회원 권한을 선택해주세요.")
    private UserRole role;
}
