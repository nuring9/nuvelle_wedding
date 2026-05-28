package com.nuvelle.wedding.auth.controller;

import com.nuvelle.wedding.auth.dto.LoginRequest;
import com.nuvelle.wedding.auth.dto.PasswordResetConfirmRequest;
import com.nuvelle.wedding.auth.dto.PasswordResetRequest;
import com.nuvelle.wedding.auth.dto.ReissueRequest;
import com.nuvelle.wedding.auth.dto.SignupRequest;
import com.nuvelle.wedding.auth.dto.TokenResponse;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.auth.service.AuthService;
import com.nuvelle.wedding.auth.service.KakaoAuthService;
import com.nuvelle.wedding.auth.service.PasswordResetService;
import com.nuvelle.wedding.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final KakaoAuthService kakaoAuthService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<TokenResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        TokenResponse response = authService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다.", response));
    }

    @PostMapping("login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", response));
    }

    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<TokenResponse>> reissue(
            @Valid @RequestBody ReissueRequest request) {
        TokenResponse response = authService.reissue(request);
        return ResponseEntity.ok(ApiResponse.success("토큰이 재발급되었습니다.", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails);
        return ResponseEntity.ok(ApiResponse.success("로그아웃이 완료되었습니다."));
    }

    @PostMapping("/kakao")
    public ResponseEntity<ApiResponse<TokenResponse>> kakaoLogin(
            @RequestParam String code) {
        TokenResponse response = kakaoAuthService.kakaoLogin(code);
        return ResponseEntity.ok(ApiResponse.success("카카오 로그인이 완료되었습니다.", response));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse<Void>> requestPasswordReset(
            @Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.requestReset(request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호 재설정 링크가 발송되었습니다."));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmPasswordReset(
            @Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.confirmReset(request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 재설정되었습니다."));
    }
}
