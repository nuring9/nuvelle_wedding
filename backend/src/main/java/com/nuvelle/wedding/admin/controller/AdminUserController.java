package com.nuvelle.wedding.admin.controller;

import com.nuvelle.wedding.admin.dto.AdminUserResponse;
import com.nuvelle.wedding.admin.dto.AdminUserRoleRequest;
import com.nuvelle.wedding.admin.dto.AdminUserStatusRequest;
import com.nuvelle.wedding.admin.service.AdminUserService;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.user.entity.UserStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status) {
        List<AdminUserResponse> response = adminUserService.getUsers(keyword, status);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> getUser(
            @PathVariable Long userId) {
        AdminUserResponse response = adminUserService.getUser(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> changeStatus(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserStatusRequest request) {
        AdminUserResponse response = adminUserService.changeStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("회원 상태가 변경되었습니다.", response));
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<AdminUserResponse>> changeRole(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserRoleRequest request,
            @AuthenticationPrincipal CustomUserDetails adminDetails) {
        AdminUserResponse response = adminUserService.changeRole(userId, request, adminDetails);
        return ResponseEntity.ok(ApiResponse.success("회원 권한이 변경되었습니다.", response));
    }

    @PatchMapping("/{userId}/withdraw")
    public ResponseEntity<ApiResponse<AdminUserResponse>> withdraw(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails adminDetails) {
        AdminUserResponse response = adminUserService.withdraw(userId, adminDetails);
        return ResponseEntity.ok(ApiResponse.success("회원이 탈퇴 처리되었습니다.", response));
    }
}
