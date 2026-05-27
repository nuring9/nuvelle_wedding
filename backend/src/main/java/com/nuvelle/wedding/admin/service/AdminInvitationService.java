package com.nuvelle.wedding.admin.service;

import com.nuvelle.wedding.admin.dto.AdminInvitationSummaryResponse;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.dto.InvitationResponse;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminInvitationService {

    private final InvitationRepository invitationRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Transactional(readOnly = true)
    public List<AdminInvitationSummaryResponse> getPublishedInvitations() {
        return invitationRepository.findAllPublishedForAdmin()
                .stream()
                .map(i -> AdminInvitationSummaryResponse.from(i, baseUrl))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InvitationResponse getInvitation(Long invitationId) {
        Invitation invitation = invitationRepository.findByIdWithGalleries(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));
        return InvitationResponse.from(invitation, baseUrl);
    }
}