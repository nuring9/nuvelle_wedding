package com.nuvelle.wedding.invitation.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
public class InvitationUpdateRequest {
    private String title;
    private String mainImageUrl;
    private String mainOverlayText;
    private String mainImagePosition;

    // 신랑·신부
    private String groomName;
    private String brideName;
    private String groomPhone;
    private String bridePhone;
    private Boolean contactEnabled;

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

    private List<InvitationAccountRequest> accounts;

    // 섹션 on/off (기본값 처리를 위해 Boolean 래퍼 사용)
    private Boolean galleryEnabled;
    private Boolean rsvpEnabled;
    private Boolean guestbookEnabled;
    private Boolean accountEnabled;
    private Boolean parentsEnabled;
    private Boolean ddayEnabled;

    // 스타일
    private String theme;
    private String fontFamily;
    private String galleryLayout;
    private String animationType;

    // BGM
    private Long bgmId;

    // 신랑 신부 소개글
    private String groomIntroduction;
    private String brideIntroduction;

    // 송금 링크
    private String remittanceLink;

    // 인터뷰
    private Boolean interviewEnabled;

    // 게스트 사진 업로드
    private Boolean guestPhotoEnabled;

    // 섹션 순서
    private List<String> sectionOrder;
}
