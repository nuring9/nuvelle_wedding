package com.nuvelle.wedding.auth.service;

import com.nuvelle.wedding.auth.dto.LoginRequest;
import com.nuvelle.wedding.auth.dto.ReissueRequest;
import com.nuvelle.wedding.auth.dto.SignupRequest;
import com.nuvelle.wedding.auth.dto.TokenResponse;
import com.nuvelle.wedding.auth.jwt.JwtTokenProvider;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.entity.UserRole;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public TokenResponse signup(SignupRequest request){
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(UserRole.ROLE_USER)
                .build();

        userRepository.save(user);

        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());

        String refreshToke = jwtTokenProvider.createRefreshToken(user.getId());

        refreshTokenService.save(user.getId(), refreshToke, jwtTokenProvider.getRefreshTokenExpiration());

        return TokenResponse.of(accessToken, refreshToke, user.getId(), user.getName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        refreshTokenService.save(user.getId(), refreshToken,
                jwtTokenProvider.getRefreshTokenExpiration());

        return TokenResponse.of(accessToken, refreshToken,
                user.getId(), user.getName(), user.getEmail());
    }

    @Transactional
    public TokenResponse reissue(ReissueRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        String savedToken = refreshTokenService.get(userId);

        if (!savedToken.equals(refreshToken)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_MISMATCH);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        refreshTokenService.save(user.getId(), newRefreshToken,
                jwtTokenProvider.getRefreshTokenExpiration());

        return TokenResponse.of(newAccessToken, newRefreshToken,
                user.getId(), user.getName(), user.getEmail());
    }

    public void logout(CustomUserDetails userDetails) {
        refreshTokenService.delete(userDetails.getUserId());
    }

}
