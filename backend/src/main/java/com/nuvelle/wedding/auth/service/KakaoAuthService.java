package com.nuvelle.wedding.auth.service;

import com.nuvelle.wedding.auth.dto.KakaoTokenResponse;
import com.nuvelle.wedding.auth.dto.KakaoUserInfoResponse;
import com.nuvelle.wedding.auth.dto.TokenResponse;
import com.nuvelle.wedding.auth.jwt.JwtTokenProvider;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.entity.UserRole;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final WebClient kakaoAuthClient = WebClient.builder()
            .baseUrl("https://kauth.kakao.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
            .build();

    private final WebClient kakaoApiClient = WebClient.builder()
            .baseUrl("https://kapi.kakao.com")
            .build();

    @Transactional
    public TokenResponse kakaoLogin(String code) {
        String kakaoAccessToken = getKakaoAccessToken(code);
        KakaoUserInfoResponse userInfo = getKakaoUserInfo(kakaoAccessToken);

        User user = userRepository.findByKakaoId(userInfo.getId())
                .orElseGet(() -> createKakaoUser(userInfo));

        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        refreshTokenService.save(user.getId(), refreshToken,
                jwtTokenProvider.getRefreshTokenExpiration());

        return TokenResponse.of(accessToken, refreshToken,
                user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    private String getKakaoAccessToken(String code) {
        log.info("[Kakao] 토큰 교환 시작 - client_id: {}, redirect_uri: {}", clientId, redirectUri);
        try {
            KakaoTokenResponse response = kakaoAuthClient.post()
                    .uri("/oauth/token")
                    .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                            .with("client_id", clientId)
                            .with("client_secret", clientSecret)
                            .with("redirect_uri", redirectUri)
                            .with("code", code))
                    .retrieve()
                    .bodyToMono(KakaoTokenResponse.class)
                    .block();

            if (response == null || response.getAccessToken() == null) {
                log.error("[Kakao] 토큰 응답이 비어있음");
                throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
            }
            log.info("[Kakao] 토큰 교환 성공");
            return response.getAccessToken();
        } catch (CustomException e) {
            throw e;
        } catch (WebClientResponseException e) {
            log.error("[Kakao] 토큰 교환 실패 - status: {}, body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
        } catch (Exception e) {
            log.error("[Kakao] 토큰 교환 중 예외 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
        }
    }

    private KakaoUserInfoResponse getKakaoUserInfo(String kakaoAccessToken) {
        try {
            KakaoUserInfoResponse response = kakaoApiClient.get()
                    .uri("/v2/user/me")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + kakaoAccessToken)
                    .retrieve()
                    .bodyToMono(KakaoUserInfoResponse.class)
                    .block();

            if (response == null || response.getId() == null) {
                throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
            }
            return response;
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomException(ErrorCode.KAKAO_AUTH_FAILED);
        }
    }

    private User createKakaoUser(KakaoUserInfoResponse userInfo) {
        String email = userInfo.getEmail() != null
                ? userInfo.getEmail()
                : "kakao_" + userInfo.getId() + "@kakao.local";

        // 같은 이메일로 일반 가입한 계정이 있으면 kakaoId만 연결
        return userRepository.findByEmail(email)
                .map(existingUser -> existingUser)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .email(email)
                                .password(null)
                                .name(userInfo.getNickname())
                                .role(UserRole.ROLE_USER)
                                .kakaoId(userInfo.getId())
                                .build()
                ));
    }
}
