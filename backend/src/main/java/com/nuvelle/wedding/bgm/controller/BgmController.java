package com.nuvelle.wedding.bgm.controller;

import com.nuvelle.wedding.bgm.dto.BgmResponse;
import com.nuvelle.wedding.bgm.service.BgmService;
import com.nuvelle.wedding.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BgmController {

    private final BgmService bgmService;

    @GetMapping("/api/bgms")
    public ResponseEntity<ApiResponse<List<BgmResponse>>> getBgms() {
        List<BgmResponse> response = bgmService.getActiveBgms();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}