package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.InvitationGallery;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GalleryImageResponse {

    private Long id;
    private String imageUrl;
    private int sortOrder;

    public static GalleryImageResponse from(InvitationGallery gallery) {
        return GalleryImageResponse.builder()
                .id(gallery.getId())
                .imageUrl(gallery.getImageUrl())
                .sortOrder(gallery.getSortOrder())
                .build();
    }
}