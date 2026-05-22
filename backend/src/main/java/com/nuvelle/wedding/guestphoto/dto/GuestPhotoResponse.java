package com.nuvelle.wedding.guestphoto.dto;

import com.nuvelle.wedding.guestphoto.entity.GuestPhoto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GuestPhotoResponse {

    private Long id;
    private String imageUrl;
    private String uploaderName;
    private String message;
    private LocalDateTime createdAt;

    public static GuestPhotoResponse from(GuestPhoto photo) {
        return GuestPhotoResponse.builder()
                .id(photo.getId())
                .imageUrl(photo.getImageUrl())
                .uploaderName(photo.getUploaderName())
                .message(photo.getMessage())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}
