package com.nuvelle.wedding.invitation.service;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.dto.*;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationGallery;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import com.nuvelle.wedding.invitation.repository.InvitationGalleryRepository;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import com.nuvelle.wedding.template.entity.Template;
import com.nuvelle.wedding.template.repository.TemplateRepository;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final InvitationGalleryRepository galleryRepository;
    private final TemplateRepository templateRepository;
    private final UserRepository userRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    // 청첩장 생성
    @Transactional
    public InvitationResponse create(InvitationCreateRequest request, CustomUserDetails userDetails) {
        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Template template = templateRepository.findByIdAndIsActiveTrue(request.getTemplateId())
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));

        String slug = generateUniqueSlug();

        Invitation invitation = Invitation.builder()
                .user(user)
                .template(template)
                .slug(slug)
                .status(InvitationStatus.DRAFT)
                .title(request.getTitle())
                .build();

        invitationRepository.save(invitation);

        return InvitationResponse.from(invitation, baseUrl);
    }

    // 내 청첩장 목록
    @Transactional(readOnly = true)
    public List<InvitationSummaryResponse> getMyInvitations(CustomUserDetails userDetails) {
        return invitationRepository.findAllByUserIdOrderByCreatedAtDesc(userDetails.getUserId())
                .stream()
                .map(InvitationSummaryResponse::from)
                .collect(Collectors.toList());
    }

    // 청첩장 단건 조회 (작성자용)
    @Transactional(readOnly = true)
    public InvitationResponse getInvitation(Long invitationId, CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findByIdWithGalleries(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());

        return InvitationResponse.from(invitation, baseUrl);
    }

    // 청첩장 수정 (임시저장)
    @Transactional
    public InvitationResponse update(Long invitationId,
                                     InvitationUpdateRequest request,
                                     CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findByIdWithGalleries(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());

        invitation.update(
                request.getTitle(),
                request.getMainImageUrl(),
                request.getGroomName(),
                request.getBrideName(),
                request.getGroomFatherName(),
                request.getGroomMotherName(),
                request.getBrideFatherName(),
                request.getBrideMotherName(),
                request.getGreetingText(),
                request.getWeddingDate(),
                request.getWeddingTime(),
                request.getVenueName(),
                request.getVenueAddress(),
                request.getVenueDetail(),
                request.getTransportInfo(),
                request.getMapLat(),
                request.getMapLng(),
                request.getAccountBank(),
                request.getAccountNumber(),
                request.getAccountHolder(),
                request.getGalleryEnabled() != null ? request.getGalleryEnabled() : invitation.isGalleryEnabled(),
                request.getRsvpEnabled() != null ? request.getRsvpEnabled() : invitation.isRsvpEnabled(),
                request.getGuestbookEnabled() != null ? request.getGuestbookEnabled() : invitation.isGuestbookEnabled(),
                request.getAccountEnabled() != null ? request.getAccountEnabled() : invitation.isAccountEnabled(),
                request.getParentsEnabled() != null ? request.getParentsEnabled() : invitation.isParentsEnabled(),
                request.getDdayEnabled() != null ? request.getDdayEnabled() : invitation.isDdayEnabled(),
                request.getTheme(),
                request.getFontFamily(),
                request.getGalleryLayout(),
                request.getAnimationType(),
                request.getBgmUrl()
        );

        return InvitationResponse.from(invitation, baseUrl);
    }

    // 발행
    @Transactional
    public InvitationResponse publish(Long invitationId, CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findByIdWithGalleries(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());
        invitation.publish();

        return InvitationResponse.from(invitation, baseUrl);
    }

    // 비공개
    @Transactional
    public InvitationResponse makePrivate(Long invitationId, CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findByIdWithGalleries(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());
        invitation.makePrivate();

        return InvitationResponse.from(invitation, baseUrl);
    }

    // 청첩장 삭제
    @Transactional
    public void delete(Long invitationId, CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());
        invitationRepository.delete(invitation);
    }

    // 갤러리 이미지 추가
    @Transactional
    public GalleryImageResponse addGalleryImage(Long invitationId,
                                                String imageUrl,
                                                CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());

        int nextOrder = galleryRepository.countByInvitationId(invitationId);

        InvitationGallery gallery = InvitationGallery.builder()
                .invitation(invitation)
                .imageUrl(imageUrl)
                .sortOrder(nextOrder)
                .build();

        galleryRepository.save(gallery);

        return GalleryImageResponse.from(gallery);
    }

    // 갤러리 이미지 삭제
    @Transactional
    public void deleteGalleryImage(Long invitationId, Long imageId, CustomUserDetails userDetails) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        validateOwner(invitation, userDetails.getUserId());

        InvitationGallery gallery = galleryRepository.findByIdAndInvitationId(imageId, invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

        galleryRepository.delete(gallery);
    }

    // slug 생성 (UUID 앞 8자리 기반)
    private String generateUniqueSlug() {
        String slug;
        do {
            slug = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (invitationRepository.existsBySlug(slug));
        return slug;
    }

    // 작성자 검증
    private void validateOwner(Invitation invitation, Long userId) {
        if (!invitation.isOwnedBy(userId)) {
            throw new CustomException(ErrorCode.INVITATION_ACCESS_DENIED);
        }
    }
}