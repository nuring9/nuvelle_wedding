package com.nuvelle.wedding.invitation.controller;

import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.invitation.dto.PublicInvitationResponse;
import com.nuvelle.wedding.invitation.service.PublicInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/invitations")
@RequiredArgsConstructor
public class PublicInvitationController {

    private final PublicInvitationService publicInvitationService;

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PublicInvitationResponse>> getPublicInvitation(
            @PathVariable String slug) {
        PublicInvitationResponse response = publicInvitationService.getPublicInvitation(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}