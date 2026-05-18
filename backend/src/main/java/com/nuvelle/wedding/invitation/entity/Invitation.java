package com.nuvelle.wedding.invitation.entity;

import com.nuvelle.wedding.template.entity.Template;
import com.nuvelle.wedding.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InvitationStatus status;

    @Column(length = 100)
    private String title;

    @Column(name = "main_image_url")
    private String mainImageUrl;

    // 신랑·신부 정보
    @Column(name = "groom_name", length = 50)
    private String groomName;

    @Column(name = "bride_name", length = 50)
    private String brideName;

    // 부모님 정보
    @Column(name = "groom_father_name", length = 50)
    private String groomFatherName;

    @Column(name = "groom_mother_name", length = 50)
    private String groomMotherName;

    @Column(name = "bride_father_name", length = 50)
    private String brideFatherName;

    @Column(name = "bride_mother_name", length = 50)
    private String brideMotherName;

    // 인사말 / 예식 정보
    @Column(name = "greeting_text", columnDefinition = "TEXT")
    private String greetingText;

    @Column(name = "wedding_date")
    private LocalDate weddingDate;

    @Column(name = "wedding_time")
    private LocalTime weddingTime;

    @Column(name = "venue_name", length = 100)
    private String venueName;

    @Column(name = "venue_address", length = 200)
    private String venueAddress;

    @Column(name = "venue_detail", length = 200)
    private String venueDetail;

    @Column(name = "transport_info", columnDefinition = "TEXT")
    private String transportInfo;

    // 지도
    @Column(name = "map_lat")
    private Double mapLat;

    @Column(name = "map_lng")
    private Double mapLng;

    // 계좌
    @Column(name = "account_bank", length = 50)
    private String accountBank;

    @Column(name = "account_number", length = 50)
    private String accountNumber;

    @Column(name = "account_holder", length = 50)
    private String accountHolder;

    // 섹션 on/off
    @Column(name = "gallery_enabled", nullable = false)
    private boolean galleryEnabled = true;

    @Column(name = "rsvp_enabled", nullable = false)
    private boolean rsvpEnabled = false;

    @Column(name = "guestbook_enabled", nullable = false)
    private boolean guestbookEnabled = false;

    @Column(name = "account_enabled", nullable = false)
    private boolean accountEnabled = false;

    @Column(name = "parents_enabled", nullable = false)
    private boolean parentsEnabled = true;

    @Column(name = "dday_enabled", nullable = false)
    private boolean ddayEnabled = false;

    // 스타일
    @Column(name = "theme", length = 50)
    private String theme;

    @Column(name = "font_family", length = 50)
    private String fontFamily;

    @Column(name = "gallery_layout", length = 50)
    private String galleryLayout;

    @Column(name = "animation_type", length = 50)
    private String animationType;

    @Column(name = "bgm_url")
    private String bgmUrl;

    // 공유 / 발행
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 청첩장과 갤러리 이미지의 일대다 관계
    @OneToMany(mappedBy = "invitation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<InvitationGallery> galleries = new ArrayList<>();

    @Builder
    public Invitation(User user, Template template, String slug, InvitationStatus status, String title) {
        this.user = user;
        this.template = template;
        this.slug = slug;
        this.status = status;
        this.title = title;
    }

    public void update(String title, String mainImageUrl, String groomName, String brideName, String groomFatherName,
                       String groomMotherName, String brideFatherName, String brideMotherName, String greetingText,
                       LocalDate weddingDate, LocalTime weddingTime, String venueName, String venueAddress,
                       String venueDetail, String transportInfo, Double mapLat, Double mapLng, String accountBank,
                       String accountNumber, String accountHolder, boolean galleryEnabled, boolean rsvpEnabled,
                       boolean guestbookEnabled, boolean accountEnabled, boolean parentsEnabled, boolean ddayEnabled,
                       String theme, String fontFamily, String galleryLayout, String animationType, String bgmUrl) {
        this.title = title;
        this.mainImageUrl = mainImageUrl;
        this.groomName = groomName;
        this.brideName = brideName;
        this.groomFatherName = groomFatherName;
        this.groomMotherName = groomMotherName;
        this.brideFatherName = brideFatherName;
        this.brideMotherName = brideMotherName;
        this.greetingText = greetingText;
        this.weddingDate = weddingDate;
        this.weddingTime = weddingTime;
        this.venueName = venueName;
        this.venueAddress = venueAddress;
        this.venueDetail = venueDetail;
        this.transportInfo = transportInfo;
        this.mapLat = mapLat;
        this.mapLng = mapLng;
        this.accountBank = accountBank;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.galleryEnabled = galleryEnabled;
        this.rsvpEnabled = rsvpEnabled;
        this.guestbookEnabled = guestbookEnabled;
        this.accountEnabled = accountEnabled;
        this.parentsEnabled = parentsEnabled;
        this.ddayEnabled = ddayEnabled;
        this.theme = theme;
        this.fontFamily = fontFamily;
        this.galleryLayout = galleryLayout;
        this.animationType = animationType;
        this.bgmUrl = bgmUrl;
    }

    public void publish(){
        this.status = InvitationStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
    }

    public void makePrivate() {
        this.status = InvitationStatus.PRIVATE;
    }

    public void makeDraft() {
        this.status = InvitationStatus.DRAFT;
    }

    public boolean isOwnedBy(Long userId) {
        return this.user.getId().equals(userId);
    }
}
