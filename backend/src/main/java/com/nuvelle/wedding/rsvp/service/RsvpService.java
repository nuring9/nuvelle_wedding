package com.nuvelle.wedding.rsvp.service;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import com.nuvelle.wedding.rsvp.dto.RsvpRequest;
import com.nuvelle.wedding.rsvp.dto.RsvpResponse;
import com.nuvelle.wedding.rsvp.entity.Rsvp;
import com.nuvelle.wedding.rsvp.repository.RsvpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final InvitationRepository invitationRepository;

    // 공개 청첩장에 RSVP 등록
    @Transactional
    public RsvpResponse create(String slug, RsvpRequest request) {
        Invitation invitation = invitationRepository
                .findBySlugAndStatus(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        if (!invitation.isRsvpEnabled()) {
            throw new CustomException(ErrorCode.RSVP_NOT_ALLOWED);
        }

        Rsvp rsvp = Rsvp.builder()
                .invitation(invitation)
                .guestName(request.getGuestName())
                .attendanceStatus(request.getAttendanceStatus())
                .guestCount(request.getGuestCount())
                .message(request.getMessage())
                .phone(request.getPhone())
                .build();

        rsvpRepository.save(rsvp);

        return RsvpResponse.from(rsvp);
    }

    // 작성자용 RSVP 목록 조회
    @Transactional(readOnly = true)
    public List<RsvpResponse> getRsvpList(Long invitationId) {
        return rsvpRepository.findAllByInvitationIdOrderByCreatedAtDesc(invitationId)
                .stream()
                .map(RsvpResponse::from)
                .collect(Collectors.toList());
    }
}