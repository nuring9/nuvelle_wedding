package com.nuvelle.wedding.honeymoon.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.honeymoon.dto.*;
import com.nuvelle.wedding.honeymoon.service.HoneymoonPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/honeymoon/plans")
@RequiredArgsConstructor
public class HoneymoonPlanController {

    private final HoneymoonPlanService planService;

    // AI 일정 생성
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<HoneymoonPlanResponse>> generate(
            @Valid @RequestBody HoneymoonPlanGenerateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanResponse response = planService.generate(request, userDetails);
        return ResponseEntity.ok(
                ApiResponse.success("신혼여행 일정이 생성되었습니다.", response));
    }

    // 내 플랜 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<HoneymoonPlanSummaryResponse>>> getMyPlans(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<HoneymoonPlanSummaryResponse> responses = planService.getMyPlans(userDetails);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // 플랜 상세 조회
    @GetMapping("/{planId}")
    public ResponseEntity<ApiResponse<HoneymoonPlanResponse>> getPlan(
            @PathVariable Long planId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanResponse response = planService.getPlan(planId, userDetails);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 플랜 수정
    @PatchMapping("/{planId}")
    public ResponseEntity<ApiResponse<HoneymoonPlanResponse>> updatePlan(
            @PathVariable Long planId,
            @RequestBody HoneymoonPlanUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanResponse response =
                planService.updatePlan(planId, request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("플랜이 수정되었습니다.", response));
    }

    // 플랜 확정 (DRAFT → SAVED)
    @PostMapping("/{planId}/save")
    public ResponseEntity<ApiResponse<HoneymoonPlanResponse>> savePlan(
            @PathVariable Long planId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanResponse response = planService.savePlan(planId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("플랜이 확정되었습니다.", response));
    }

    // 플랜 삭제
    @DeleteMapping("/{planId}")
    public ResponseEntity<ApiResponse<Void>> deletePlan(
            @PathVariable Long planId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        planService.deletePlan(planId, userDetails);
        return ResponseEntity.ok(ApiResponse.success("플랜이 삭제되었습니다.", null));
    }

    // Day별 일정 수정
    @PatchMapping("/{planId}/days/{dayId}")
    public ResponseEntity<ApiResponse<HoneymoonPlanDayResponse>> updateDay(
            @PathVariable Long planId,
            @PathVariable Long dayId,
            @RequestBody HoneymoonPlanDayUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        HoneymoonPlanDayResponse response =
                planService.updateDay(planId, dayId, request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("일정이 수정되었습니다.", response));
    }
}
