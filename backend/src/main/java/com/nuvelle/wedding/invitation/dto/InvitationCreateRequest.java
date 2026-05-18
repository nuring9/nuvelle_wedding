package com.nuvelle.wedding.invitation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class InvitationCreateRequest {

    @NotNull(message = "템플릿 ID는 필수입니다.")
    private Long templateId;

    private String title;
}
