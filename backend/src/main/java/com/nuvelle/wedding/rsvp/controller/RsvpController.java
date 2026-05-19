package com.nuvelle.wedding.rsvp.controller;

import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.rsvp.dto.RsvpRequest;
import com.nuvelle.wedding.rsvp.dto.RsvpResponse;
import com.nuvelle.wedding.rsvp.service.RsvpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RsvpController {

    private final RsvpService rsvpService;

    // 공개 RSVP 등록
    @PostMapping("/api/public/invitations/{slug}/rsvp")
    public ResponseEntity<ApiResponse<RsvpResponse>> create(
            @PathVariable String slug,
            @Valid @RequestBody RsvpRequest request) {
        RsvpResponse response = rsvpService.create(slug, request);
        return ResponseEntity.ok(ApiResponse.success("RSVP가 등록되었습니다.", response));
    }

    // 작성자용 RSVP 목록 조회
    @GetMapping("/api/invitations/{invitationId}/rsvps")
    public ResponseEntity<ApiResponse<List<RsvpResponse>>> getRsvpList(
            @PathVariable Long invitationId) {
        List<RsvpResponse> responses = rsvpService.getRsvpList(invitationId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}