package com.nuvelle.wedding.invitation.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.invitation.dto.*;
import com.nuvelle.wedding.invitation.service.InvitationService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    // 청첩장 생성
    @PostMapping
    public ResponseEntity<ApiResponse<InvitationResponse>> create(
            @Valid @RequestBody InvitationCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InvitationResponse response = invitationService.create(request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("청첩장이 생성되었습니다.", response));
    }

    // 내 청첩장 목록
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvitationSummaryResponse>>> getMyInvitations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<InvitationSummaryResponse> responses = invitationService.getMyInvitations(userDetails);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // 청첩장 단건 조회
    @GetMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<InvitationResponse>> getInvitation(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InvitationResponse response = invitationService.getInvitation(invitationId, userDetails);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 청첩장 수정 (임시저장 포함)
    @PatchMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<InvitationResponse>> update(
            @PathVariable Long invitationId,
            @RequestBody InvitationUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InvitationResponse response = invitationService.update(invitationId, request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("저장되었습니다.", response));
    }

    // 발행
    @PostMapping("/{invitationId}/publish")
    public ResponseEntity<ApiResponse<InvitationResponse>> publish(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InvitationResponse response = invitationService.publish(invitationId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("청첩장이 발행되었습니다.", response));
    }

    // 비공개
    @PostMapping("/{invitationId}/private")
    public ResponseEntity<ApiResponse<InvitationResponse>> makePrivate(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        InvitationResponse response = invitationService.makePrivate(invitationId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("비공개로 전환되었습니다.", response));
    }

    // 삭제
    @DeleteMapping("/{invitationId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        invitationService.delete(invitationId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("청첩장이 삭제되었습니다."));
    }

    // 갤러리 이미지 추가
    @PostMapping("/{invitationId}/gallery")
    public ResponseEntity<ApiResponse<GalleryImageResponse>> addGalleryImage(
            @PathVariable Long invitationId,
            @RequestBody GalleryAddRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        GalleryImageResponse response = invitationService.addGalleryImage(
                invitationId, request.getImageUrl(), userDetails);
        return ResponseEntity.ok(ApiResponse.success("이미지가 추가되었습니다.", response));
    }

    // 갤러리 이미지 삭제
    @DeleteMapping("/{invitationId}/gallery/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteGalleryImage(
            @PathVariable Long invitationId,
            @PathVariable Long imageId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        invitationService.deleteGalleryImage(invitationId, imageId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("이미지가 삭제되었습니다."));
    }

    // 갤러리 추가용 내부 DTO
    @Getter
    @Setter
    static class GalleryAddRequest {
        private String imageUrl;
    }
}