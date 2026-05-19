package com.nuvelle.wedding.guestbook.service;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.guestbook.dto.GuestbookRequest;
import com.nuvelle.wedding.guestbook.dto.GuestbookResponse;
import com.nuvelle.wedding.guestbook.entity.Guestbook;
import com.nuvelle.wedding.guestbook.repository.GuestbookRepository;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestbookService {

    private final GuestbookRepository guestbookRepository;
    private final InvitationRepository invitationRepository;

    // 방명록 등록
    @Transactional
    public GuestbookResponse create(String slug, GuestbookRequest request) {
        Invitation invitation = invitationRepository
                .findBySlugAndStatus(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        if (!invitation.isGuestbookEnabled()) {
            throw new CustomException(ErrorCode.GUESTBOOK_NOT_ALLOWED);
        }

        Guestbook guestbook = Guestbook.builder()
                .invitation(invitation)
                .guestName(request.getGuestName())
                .message(request.getMessage())
                .isHidden(false)
                .build();

        guestbookRepository.save(guestbook);

        return GuestbookResponse.from(guestbook);
    }

    // 공개 방명록 목록 조회 (숨김 제외)
    @Transactional(readOnly = true)
    public List<GuestbookResponse> getPublicList(String slug) {
        Invitation invitation = invitationRepository
                .findBySlugAndStatus(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        return guestbookRepository
                .findAllByInvitationIdAndIsHiddenFalseOrderByCreatedAtDesc(invitation.getId())
                .stream()
                .map(GuestbookResponse::from)
                .collect(Collectors.toList());
    }

    // 방명록 숨김 처리 (작성자용)
    @Transactional
    public GuestbookResponse hide(Long guestbookId) {
        Guestbook guestbook = guestbookRepository.findById(guestbookId)
                .orElseThrow(() -> new CustomException(ErrorCode.GUESTBOOK_NOT_FOUND));
        guestbook.hide();
        return GuestbookResponse.from(guestbook);
    }
}