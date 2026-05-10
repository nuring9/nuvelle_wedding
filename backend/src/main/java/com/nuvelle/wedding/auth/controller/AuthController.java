package com.nuvelle.wedding.auth.controller;

import com.nuvelle.wedding.auth.dto.LoginRequest;
import com.nuvelle.wedding.auth.dto.ReissueRequest;
import com.nuvelle.wedding.auth.dto.SignupRequest;
import com.nuvelle.wedding.auth.dto.TokenResponse;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.auth.service.AuthService;
import com.nuvelle.wedding.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}
