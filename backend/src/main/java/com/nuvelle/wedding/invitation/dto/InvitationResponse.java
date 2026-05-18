package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class InvitationResponse {

    private Long id;
    private Long templateId;
    private String templateName;
    private String slug;
    private InvitationStatus status;
    private String title;
    private String mainImageUrl;

    // 신랑·신부
    private String groomName;
    private String brideName;

    // 부모님
    private String groomFatherName;
    private String groomMotherName;
    private String brideFatherName;
    private String brideMotherName;

    // 인사말 / 예식
    private String greetingText;
    private LocalDate weddingDate;
    private LocalTime weddingTime;
    private String venueName;
    private String venueAddress;
    private String venueDetail;
    private String transportInfo;

    // 지도
    private Double mapLat;
    private Double mapLng;

    // 계좌
    private String accountBank;
    private String accountNumber;
    private String accountHolder;

    // 섹션 on/off
    private boolean galleryEnabled;
    private boolean rsvpEnabled;
    private boolean guestbookEnabled;
    private boolean accountEnabled;
    private boolean parentsEnabled;
    private boolean ddayEnabled;

    // 스타일
    private String theme;
    private String fontFamily;
    private String galleryLayout;
    private String animationType;
    private String bgmUrl;

    // 갤러리
    private List<GalleryImageResponse> galleries;

    // 공유 URL (slug 기반)
    private String publicUrl;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static InvitationResponse from(Invitation invitation, String baseUrl) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .templateId(invitation.getTemplate().getId())
                .templateName(invitation.getTemplate().getName())
                .slug(invitation.getSlug())
                .status(invitation.getStatus())
                .title(invitation.getTitle())
                .mainImageUrl(invitation.getMainImageUrl())
                .groomName(invitation.getGroomName())
                .brideName(invitation.getBrideName())
                .groomFatherName(invitation.getGroomFatherName())
                .groomMotherName(invitation.getGroomMotherName())
                .brideFatherName(invitation.getBrideFatherName())
                .brideMotherName(invitation.getBrideMotherName())
                .greetingText(invitation.getGreetingText())
                .weddingDate(invitation.getWeddingDate())
                .weddingTime(invitation.getWeddingTime())
                .venueName(invitation.getVenueName())
                .venueAddress(invitation.getVenueAddress())
                .venueDetail(invitation.getVenueDetail())
                .transportInfo(invitation.getTransportInfo())
                .mapLat(invitation.getMapLat())
                .mapLng(invitation.getMapLng())
                .accountBank(invitation.getAccountBank())
                .accountNumber(invitation.getAccountNumber())
                .accountHolder(invitation.getAccountHolder())
                .galleryEnabled(invitation.isGalleryEnabled())
                .rsvpEnabled(invitation.isRsvpEnabled())
                .guestbookEnabled(invitation.isGuestbookEnabled())
                .accountEnabled(invitation.isAccountEnabled())
                .parentsEnabled(invitation.isParentsEnabled())
                .ddayEnabled(invitation.isDdayEnabled())
                .theme(invitation.getTheme())
                .fontFamily(invitation.getFontFamily())
                .galleryLayout(invitation.getGalleryLayout())
                .animationType(invitation.getAnimationType())
                .bgmUrl(invitation.getBgmUrl())
                .galleries(invitation.getGalleries().stream()
                        .map(GalleryImageResponse::from)
                        .collect(Collectors.toList()))
                .publicUrl(invitation.getStatus() == InvitationStatus.PUBLISHED
                        ? baseUrl + "/invite/" + invitation.getSlug()
                        : null)
                .publishedAt(invitation.getPublishedAt())
                .createdAt(invitation.getCreatedAt())
                .updatedAt(invitation.getUpdatedAt())
                .build();
    }
}
