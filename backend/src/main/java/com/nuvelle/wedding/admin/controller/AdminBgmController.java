package com.nuvelle.wedding.admin.controller;

import com.nuvelle.wedding.admin.dto.AdminBgmRequest;
import com.nuvelle.wedding.admin.dto.AdminBgmResponse;
import com.nuvelle.wedding.admin.service.AdminBgmService;
import com.nuvelle.wedding.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bgms")
@RequiredArgsConstructor
public class AdminBgmController {

    private final AdminBgmService adminBgmService;

    // GET /api/admin/bgms
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminBgmResponse>>> getAllBgms() {
        return ResponseEntity.ok(ApiResponse.success(adminBgmService.getAllBgms()));
    }

    // POST /api/admin/bgms
    @PostMapping
    public ResponseEntity<ApiResponse<AdminBgmResponse>> createBgm(@RequestBody AdminBgmRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminBgmService.createBgm(request)));
    }

    // DELETE /api/admin/bgms/{bgmId}
    @DeleteMapping("/{bgmId}")
    public ResponseEntity<ApiResponse<Void>> deleteBgm(@PathVariable Long bgmId) {
        adminBgmService.deleteBgm(bgmId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
