package com.nuvelle.wedding.admin.service;

import com.nuvelle.wedding.admin.dto.AdminBgmRequest;
import com.nuvelle.wedding.admin.dto.AdminBgmResponse;
import com.nuvelle.wedding.bgm.entity.Bgm;
import com.nuvelle.wedding.bgm.repository.BgmRepository;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBgmService {

    private final BgmRepository bgmRepository;

    @Transactional(readOnly = true)
    public List<AdminBgmResponse> getAllBgms() {
        return bgmRepository.findAll()
                .stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                .map(AdminBgmResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminBgmResponse createBgm(AdminBgmRequest request) {
        Bgm bgm = Bgm.builder()
                .title(request.getTitle())
                .fileUrl(request.getFileUrl())
                .mood(request.getMood())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        return AdminBgmResponse.from(bgmRepository.save(bgm));
    }

    @Transactional
    public AdminBgmResponse updateBgm(Long bgmId, AdminBgmRequest request) {
        Bgm bgm = bgmRepository.findById(bgmId)
                .orElseThrow(() -> new CustomException(ErrorCode.BGM_NOT_FOUND));

        bgm.update(
                request.getTitle() != null ? request.getTitle() : bgm.getTitle(),
                request.getFileUrl() != null ? request.getFileUrl() : bgm.getFileUrl(),
                request.getMood() != null ? request.getMood() : bgm.getMood(),
                request.getIsActive() != null ? request.getIsActive() : bgm.isActive(),
                request.getSortOrder() != null ? request.getSortOrder() : bgm.getSortOrder()
        );

        return AdminBgmResponse.from(bgm);
    }

    @Transactional
    public void deleteBgm(Long bgmId) {
        if (!bgmRepository.existsById(bgmId)) {
            throw new CustomException(ErrorCode.BGM_NOT_FOUND);
        }
        bgmRepository.deleteById(bgmId);
    }
}
