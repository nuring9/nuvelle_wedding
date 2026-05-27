package com.nuvelle.wedding.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long userId;
    private String name;
    private String email;
    private String role;

    public static TokenResponse of(String accessToken, String refreshToken, Long userId, String name, String email, String role) {
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(userId)
                .name(name)
                .email(email)
                .role(role)
                .build();
    }
}
