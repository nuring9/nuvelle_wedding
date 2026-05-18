package com.nuvelle.wedding.invitation.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class InvitationUpdateRequest {
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
    private String bgmUrl;
}
