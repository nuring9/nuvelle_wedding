package com.nuvelle.wedding.admin.dto;

import lombok.Getter;

@Getter
public class AdminBgmRequest {
    private String title;
    private String fileUrl;
    private String mood;
    private Boolean isActive;
    private Integer sortOrder;
}
