package com.nuvelle.wedding.honeymoon.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonChatRequest;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonChatResponse;
import com.nuvelle.wedding.honeymoon.dto.HoneymoonPlanResponse;
import com.nuvelle.wedding.honeymoon.service.HoneymoonChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/honeymoon/plans/{planId}/chat")
@RequiredArgsConstructor
public class HoneymoonChatController {

    private final HoneymoonChatService chatService;

    // 메시지 전송 + AI 응답
    @PostMapping
    public ResponseEntity<ApiResponse<HoneymoonChatResponse>> sendMessage(
            @PathVariable Long planId,
            @Valid @RequestBody HoneymoonChatRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonChatResponse response =
                chatService.sendMessage(planId, request, userDetails);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{messageId}/create-plan")
    public ResponseEntity<ApiResponse<HoneymoonPlanResponse>> createPlanFromSuggestion(
            @PathVariable Long planId,
            @PathVariable Long messageId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanResponse response =
                chatService.createPlanFromSuggestion(planId, messageId, userDetails);
        return ResponseEntity.ok(
                ApiResponse.success("AI 변경안으로 새 일정이 생성되었습니다.", response)
        );
    }

    // 대화 내역 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<HoneymoonChatResponse>>> getChatHistory(
            @PathVariable Long planId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<HoneymoonChatResponse> responses =
                chatService.getChatHistory(planId, userDetails);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
