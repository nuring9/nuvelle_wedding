package com.nuvelle.wedding.guestbook.controller;

import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.guestbook.dto.GuestbookRequest;
import com.nuvelle.wedding.guestbook.dto.GuestbookResponse;
import com.nuvelle.wedding.guestbook.service.GuestbookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookService guestbookService;

    // 공개 방명록 등록
    @PostMapping("/api/public/invitations/{slug}/guestbook")
    public ResponseEntity<ApiResponse<GuestbookResponse>> create(
            @PathVariable String slug,
            @Valid @RequestBody GuestbookRequest request) {
        GuestbookResponse response = guestbookService.create(slug, request);
        return ResponseEntity.ok(ApiResponse.success("방명록이 등록되었습니다.", response));
    }

    // 공개 방명록 목록 조회
    @GetMapping("/api/public/invitations/{slug}/guestbook")
    public ResponseEntity<ApiResponse<List<GuestbookResponse>>> getPublicList(
            @PathVariable String slug) {
        List<GuestbookResponse> responses = guestbookService.getPublicList(slug);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // 방명록 숨김 처리 (작성자용)
    @PatchMapping("/api/guestbooks/{guestbookId}")
    public ResponseEntity<ApiResponse<GuestbookResponse>> hide(
            @PathVariable Long guestbookId) {
        GuestbookResponse response = guestbookService.hide(guestbookId);
        return ResponseEntity.ok(ApiResponse.success("숨김 처리되었습니다.", response));
    }
}