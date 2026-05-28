package com.nuvelle.wedding.user.service;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.auth.service.RefreshTokenService;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.user.dto.UserWithdrawRequest;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String WITHDRAW_CONFIRM_TEXT = "탈퇴합니다";

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public void withdrawMe(UserWithdrawRequest request, CustomUserDetails userDetails) {
        if (!WITHDRAW_CONFIRM_TEXT.equals(request.getConfirmText())) {
            throw new CustomException(ErrorCode.INVALID_WITHDRAW_CONFIRM_TEXT);
        }

        User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.isWithdrawn()) {
            throw new CustomException(ErrorCode.USER_WITHDRAWN);
        }

        user.withdraw();
        refreshTokenService.delete(user.getId());
    }
}
