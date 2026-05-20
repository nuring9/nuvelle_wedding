package com.nuvelle.wedding.file.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class FileDeleteRequest {

    @NotBlank(message = "파일 URL은 필수입니다.")
    private String fileUrl;
}