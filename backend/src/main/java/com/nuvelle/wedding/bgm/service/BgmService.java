package com.nuvelle.wedding.bgm.service;

import com.nuvelle.wedding.bgm.dto.BgmResponse;
import com.nuvelle.wedding.bgm.repository.BgmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BgmService {

    private final BgmRepository bgmRepository;

    @Transactional(readOnly = true)
    public List<BgmResponse> getActiveBgms() {
        return bgmRepository.findAllByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(BgmResponse::from)
                .collect(Collectors.toList());
    }
}