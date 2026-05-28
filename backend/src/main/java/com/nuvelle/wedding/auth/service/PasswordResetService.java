package com.nuvelle.wedding.auth.service;

import com.nuvelle.wedding.auth.dto.PasswordResetConfirmRequest;
import com.nuvelle.wedding.auth.dto.PasswordResetRequest;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final String KEY_PREFIX = "password-reset:";
    private static final Duration TOKEN_TTL = Duration.ofMinutes(30);

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username:no-reply@nuvelle.local}")
    private String mailFrom;

    @Transactional(readOnly = true)
    public void requestReset(PasswordResetRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            if (!user.isActive() || !user.isLocalUser() || user.getPassword() == null) {
                return;
            }

            String token = UUID.randomUUID().toString();
            redisTemplate.opsForValue().set(KEY_PREFIX + token, String.valueOf(user.getId()), TOKEN_TTL);
            sendResetMail(user.getEmail(), token);
        });
    }

    @Transactional
    public void confirmReset(PasswordResetConfirmRequest request) {
        String key = KEY_PREFIX + request.getToken();
        String userId = redisTemplate.opsForValue().get(key);

        if (userId == null) {
            throw new CustomException(ErrorCode.PASSWORD_RESET_TOKEN_NOT_FOUND);
        }

        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!user.isActive() || !user.isLocalUser() || user.getPassword() == null) {
            throw new CustomException(ErrorCode.PASSWORD_RESET_NOT_ALLOWED);
        }

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
        redisTemplate.delete(key);
    }

    private void sendResetMail(String email, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(email);
        message.setSubject("[Nuvelle] 비밀번호 재설정 안내");
        message.setText("""
                비밀번호 재설정을 요청하셨습니다.

                아래 링크를 눌러 새 비밀번호를 설정해주세요.

                비밀번호 재설정 링크:
                %s

                이 링크는 30분 동안만 사용할 수 있습니다.
                """.formatted(resetLink));

        mailSender.send(message);
    }
}
