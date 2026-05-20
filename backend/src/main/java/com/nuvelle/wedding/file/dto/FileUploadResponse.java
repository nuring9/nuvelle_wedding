package com.nuvelle.wedding.file.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileUploadResponse {

    private String url;
    private String originalFilename;
    private long size;

    public static FileUploadResponse of(String url, String originalFilename, long size) {
        return FileUploadResponse.builder()
                .url(url)
                .originalFilename(originalFilename)
                .size(size)
                .build();
    }
}