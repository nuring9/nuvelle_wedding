package com.nuvelle.wedding.admin.dto;

import com.nuvelle.wedding.user.entity.AuthProvider;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.entity.UserRole;
import com.nuvelle.wedding.user.entity.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminUserResponse {

    private Long id;
    private String email;
    private String name;
    private UserRole role;
    private UserStatus status;
    private AuthProvider provider;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private Long invitationCount;

    public static AdminUserResponse from(User user) {
        return from(user, null);
    }

    public static AdminUserResponse from(User user, Long invitationCount) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .status(user.getStatus())
                .provider(user.getProvider())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .invitationCount(invitationCount)
                .build();
    }
}
