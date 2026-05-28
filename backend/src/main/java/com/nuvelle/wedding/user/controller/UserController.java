package com.nuvelle.wedding.user.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.user.dto.UserWithdrawRequest;
import com.nuvelle.wedding.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PatchMapping("/me/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdrawMe(
            @Valid @RequestBody UserWithdrawRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.withdrawMe(request, userDetails);
        return ResponseEntity.ok(ApiResponse.success("회원탈퇴가 완료되었습니다."));
    }
}
