package com.nuvelle.wedding.invitation.service;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.dto.PublicInvitationResponse;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublicInvitationService {

    private final InvitationRepository invitationRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Transactional(readOnly = true)
    public PublicInvitationResponse getPublicInvitation(String slug) {
        return invitationRepository.findPublishedBySlugWithGalleries(slug)
                .map(inv -> PublicInvitationResponse.from(inv, baseUrl))
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));
    }
}