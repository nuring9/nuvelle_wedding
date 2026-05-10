package com.nuvelle.wedding.auth.service;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:user";

    private final RedisTemplate<String, String> redisTemplate;

    public void save(Long userId, String refreshToken, long expirationMillis ) {
        String key = KEY_PREFIX + userId;

        redisTemplate.opsForValue().set(key, refreshToken, expirationMillis, TimeUnit.MILLISECONDS);
    }

    public String get(Long userId) {
        String key = KEY_PREFIX + userId;

        String token = redisTemplate.opsForValue().get(key);

        // 값이 없으면, 만료나 로그아웃으로 삭제된 경우
        if(token == null) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        return token;
    }

    public void delete(Long userId) {
        redisTemplate.delete(KEY_PREFIX + userId);
    }

    public boolean exists(Long userId){
        return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_PREFIX + userId));
    }
}
