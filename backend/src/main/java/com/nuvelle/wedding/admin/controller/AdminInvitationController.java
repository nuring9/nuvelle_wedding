package com.nuvelle.wedding.admin.controller;

import com.nuvelle.wedding.admin.dto.AdminInvitationSummaryResponse;
import com.nuvelle.wedding.admin.service.AdminInvitationService;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.invitation.dto.InvitationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/invitations")
@RequiredArgsConstructor
public class AdminInvitationController {

    private final AdminInvitationService adminInvitationService;

    // GET /api/admin/invitations
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminInvitationSummaryResponse>>> getPublishedInvitations() {
        return ResponseEntity.ok(ApiResponse.success(adminInvitationService.getPublishedInvitations()));
    }

    // GET /api/admin/invitations/{invitationId}
    @GetMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<InvitationResponse>> getInvitation(@PathVariable Long invitationId) {
        return ResponseEntity.ok(ApiResponse.success(adminInvitationService.getInvitation(invitationId)));
    }
}