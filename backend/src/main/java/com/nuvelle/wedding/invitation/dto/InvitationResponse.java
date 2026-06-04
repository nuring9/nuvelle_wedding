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
    private String mainOverlayText;
    private String mainImagePosition;

    // 신랑·신부
    private String groomName;
    private String brideName;
    private String groomPhone;
    private String bridePhone;
    private boolean contactEnabled;

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

    private List<InvitationAccountResponse> accounts;

    // 섹션 on/off
    private boolean galleryEnabled;
    private boolean rsvpEnabled;
    private boolean guestbookEnabled;
    private boolean accountEnabled;
    private boolean parentsEnabled;
    private boolean ddayEnabled;
    private boolean interviewEnabled; // 웨딩 인터뷰 섹션 표시 여부
    private boolean guestPhotoEnabled; // 게스트 사진 섹션 표시 여부
    private boolean photoBannerEnabled;
    private String photoBannerUrl;
    private String photoBannerPosition;
    private boolean calendarEnabled;
    private boolean qrEnabled;

    // 스타일
    private String theme;
    private String fontFamily;
    private String fontSize;
    private String galleryLayout;
    private String animationType;

    // BGM
    private Long bgmId;
    private String bgmUrl;
    private String bgmTitle;

    // 갤러리
    private List<GalleryImageResponse> galleries;

    // 공유 URL (slug 기반)
    private String publicUrl;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 섹션 순서
    private List<String> sectionOrder;

    public static InvitationResponse from(Invitation invitation, String baseUrl) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .templateId(invitation.getTemplate().getId())
                .templateName(invitation.getTemplate().getName())
                .slug(invitation.getSlug())
                .status(invitation.getStatus())
                .title(invitation.getTitle())
                .mainImageUrl(invitation.getMainImageUrl())
                .mainOverlayText(invitation.getMainOverlayText())
                .mainImagePosition(invitation.getMainImagePosition())
                .groomName(invitation.getGroomName())
                .brideName(invitation.getBrideName())
                .groomPhone(invitation.getGroomPhone())
                .bridePhone(invitation.getBridePhone())
                .contactEnabled(invitation.isContactEnabled())
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
                .accounts(toAccountResponses(invitation))
                .galleryEnabled(invitation.isGalleryEnabled())
                .rsvpEnabled(invitation.isRsvpEnabled())
                .guestbookEnabled(invitation.isGuestbookEnabled())
                .accountEnabled(invitation.isAccountEnabled())
                .parentsEnabled(invitation.isParentsEnabled())
                .ddayEnabled(invitation.isDdayEnabled())
                .interviewEnabled(invitation.isInterviewEnabled())
                .guestPhotoEnabled(invitation.isGuestPhotoEnabled())
                .photoBannerEnabled(invitation.isPhotoBannerEnabled())
                .photoBannerUrl(invitation.getPhotoBannerUrl())
                .photoBannerPosition(invitation.getPhotoBannerPosition())
                .calendarEnabled(invitation.isCalendarEnabled())
                .qrEnabled(invitation.isQrEnabled())
                .theme(invitation.getTheme())
                .fontFamily(invitation.getFontFamily())
                .fontSize(invitation.getFontSize())
                .galleryLayout(invitation.getGalleryLayout())
                .animationType(invitation.getAnimationType())
                .bgmId(invitation.getBgm() != null ? invitation.getBgm().getId() : null)
                .bgmUrl(invitation.getBgm() != null ? invitation.getBgm().getFileUrl() : null)
                .bgmTitle(invitation.getBgm() != null ? invitation.getBgm().getTitle() : null)
                .galleries(invitation.getGalleries().stream()
                        .map(GalleryImageResponse::from)
                        .collect(Collectors.toList()))
                .publicUrl(invitation.getStatus() == InvitationStatus.PUBLISHED
                        ? baseUrl + "/invite/" + invitation.getSlug()
                        : null)
                .publishedAt(invitation.getPublishedAt())
                .createdAt(invitation.getCreatedAt())
                .updatedAt(invitation.getUpdatedAt())
                .sectionOrder(invitation.getSectionOrder() == null ? List.of() : invitation.getSectionOrder())
                .build();
    }

    private static List<InvitationAccountResponse> toAccountResponses(Invitation invitation) {
        if (!invitation.getAccounts().isEmpty()) {
            return invitation.getAccounts().stream()
                    .map(InvitationAccountResponse::from)
                    .collect(Collectors.toList());
        }

        // 기존 단일 계좌 데이터가 있으면 새 계좌 목록처럼 내려줌
        if (invitation.getAccountBank() != null && invitation.getAccountNumber() != null) {
            return List.of(InvitationAccountResponse.builder()
                    .side("GROOM")
                    .label("신랑") // 공개 페이지에서 보여줄 기본 라벨은 신랑
                    .bankName(invitation.getAccountBank())
                    .accountNumber(invitation.getAccountNumber())
                    .accountHolder(invitation.getAccountHolder())
                    .remittanceLink(invitation.getRemittanceLink())
                    .build());
        }

        return List.of();
    }

}
