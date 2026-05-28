package com.nuvelle.wedding.admin.service;

import com.nuvelle.wedding.admin.dto.AdminUserResponse;
import com.nuvelle.wedding.admin.dto.AdminUserRoleRequest;
import com.nuvelle.wedding.admin.dto.AdminUserStatusRequest;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.auth.service.RefreshTokenService;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.entity.UserRole;
import com.nuvelle.wedding.user.entity.UserStatus;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final InvitationRepository invitationRepository;
    private final RefreshTokenService refreshTokenService;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers(String keyword, UserStatus status) {
        String normalizedKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;

        return userRepository.findAdminUsers(normalizedKeyword, status)
                .stream()
                .map(AdminUserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUser(Long userId) {
        User user = findUser(userId);
        long invitationCount = invitationRepository.countByUserId(userId);
        return AdminUserResponse.from(user, invitationCount);
    }

    @Transactional
    public AdminUserResponse changeStatus(Long userId, AdminUserStatusRequest request) {
        User user = findUser(userId);
        user.changeStatus(request.getStatus());

        if (request.getStatus() != UserStatus.ACTIVE) {
            refreshTokenService.delete(user.getId());
        }

        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse changeRole(Long userId,
                                        AdminUserRoleRequest request,
                                        CustomUserDetails adminDetails) {
        if (userId.equals(adminDetails.getUserId())) {
            throw new CustomException(ErrorCode.CANNOT_CHANGE_OWN_ROLE);
        }

        User user = findUser(userId);
        user.changeRole(request.getRole());
        return AdminUserResponse.from(user);
    }

    @Transactional
    public AdminUserResponse withdraw(Long userId, CustomUserDetails adminDetails) {
        if (userId.equals(adminDetails.getUserId())) {
            throw new CustomException(ErrorCode.CANNOT_WITHDRAW_ADMIN);
        }

        User user = findUser(userId);
        if (user.getRole() == UserRole.ROLE_ADMIN) {
            throw new CustomException(ErrorCode.CANNOT_WITHDRAW_ADMIN);
        }
        if (user.isWithdrawn()) {
            throw new CustomException(ErrorCode.USER_WITHDRAWN);
        }

        user.withdraw();
        refreshTokenService.delete(user.getId());
        return AdminUserResponse.from(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }
}
