package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.Invitation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class PublicInvitationResponse {

    private Long id;
    private String slug;
    private String templateId;
    private String themeKey;

    // 메인 사진
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

    // 신랑 신부 소개글
    private String groomIntroduction;
    private String brideIntroduction;

    // 송금 링크
    private String remittanceLink;

    // 인터뷰
    private boolean interviewEnabled;

    // 게스트 사진 업로드
    private boolean guestPhotoEnabled;

    // 포토 배너
    private boolean photoBannerEnabled;
    private String photoBannerUrl;
    private String photoBannerPosition;

    // 달력
    private boolean calendarEnabled;

    // QR 코드
    private boolean qrEnabled;

    // 갤러리
    private List<GalleryImageResponse> galleries;

    // 섹션 순서
    private List<String> sectionOrder;

    private String publicUrl;

    public static PublicInvitationResponse from(Invitation invitation) {
        return from(invitation, null);
    }

    public static PublicInvitationResponse from(Invitation invitation, String baseUrl) {
        return PublicInvitationResponse.builder()
                .id(invitation.getId())
                .slug(invitation.getSlug())
                .templateId(String.valueOf(invitation.getTemplate().getId()))
                .themeKey(invitation.getTemplate().getThemeKey())
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
                .theme(invitation.getTheme())
                .fontFamily(invitation.getFontFamily())
                .fontSize(invitation.getFontSize())
                .galleryLayout(invitation.getGalleryLayout())
                .animationType(invitation.getAnimationType())
                .bgmId(invitation.getBgm() != null ? invitation.getBgm().getId() : null)
                .bgmUrl(invitation.getBgm() != null ? invitation.getBgm().getFileUrl() : null)
                .bgmTitle(invitation.getBgm() != null ? invitation.getBgm().getTitle() : null)
                .groomIntroduction(invitation.getGroomIntroduction())
                .brideIntroduction(invitation.getBrideIntroduction())
                .remittanceLink(invitation.getRemittanceLink())
                .interviewEnabled(invitation.isInterviewEnabled())
                .guestPhotoEnabled(invitation.isGuestPhotoEnabled())
                .photoBannerEnabled(invitation.isPhotoBannerEnabled())
                .photoBannerUrl(invitation.getPhotoBannerUrl())
                .photoBannerPosition(invitation.getPhotoBannerPosition())
                .calendarEnabled(invitation.isCalendarEnabled())
                .qrEnabled(invitation.isQrEnabled())
                .galleries(invitation.getGalleries().stream()
                        .map(GalleryImageResponse::from)
                        .collect(Collectors.toList()))
                .sectionOrder(invitation.getSectionOrder() == null ? List.of() : invitation.getSectionOrder())
                .publicUrl(baseUrl != null ? baseUrl + "/invite/" + invitation.getSlug() : null)
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
                    .label("신랑")
                    .bankName(invitation.getAccountBank())
                    .accountNumber(invitation.getAccountNumber())
                    .accountHolder(invitation.getAccountHolder())
                    .remittanceLink(invitation.getRemittanceLink())
                    .build());
        }

        return List.of();
    }

}
