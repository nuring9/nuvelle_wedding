package com.nuvelle.wedding.invitation.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.invitation.dto.WeddingInterviewRequest;
import com.nuvelle.wedding.invitation.dto.WeddingInterviewResponse;
import com.nuvelle.wedding.invitation.service.WeddingInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invitations/{invitationId}/interview")
@RequiredArgsConstructor
public class WeddingInterviewController {

    private final WeddingInterviewService interviewService;

    // 웨딩 인터뷰 저장
    @PutMapping
    public ResponseEntity<ApiResponse<WeddingInterviewResponse>> save(
            @PathVariable Long invitationId,
            @RequestBody WeddingInterviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        WeddingInterviewResponse response = interviewService.save(
                invitationId, request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("웨딩 인터뷰가 저장되었습니다.", response));
    }

    // 웨딩 인터뷰 조회 (공개용)
    @GetMapping
    public ResponseEntity<ApiResponse<WeddingInterviewResponse>> get(
            @PathVariable Long invitationId) {
        WeddingInterviewResponse response = interviewService.get(invitationId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}