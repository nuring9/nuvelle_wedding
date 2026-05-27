package com.nuvelle.wedding.admin.controller;

import com.nuvelle.wedding.admin.dto.AdminTemplateRequest;
import com.nuvelle.wedding.admin.dto.AdminTemplateResponse;
import com.nuvelle.wedding.admin.service.AdminTemplateService;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.invitation.dto.InvitationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/templates")
@RequiredArgsConstructor
public class AdminTemplateController {

    private final AdminTemplateService adminTemplateService;

    // GET /api/admin/templates
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminTemplateResponse>>> getAllTemplates() {
        return ResponseEntity.ok(ApiResponse.success(adminTemplateService.getAllTemplates()));
    }

    // GET /api/admin/templates/{templateId}
    @GetMapping("/{templateId}")
    public ResponseEntity<ApiResponse<AdminTemplateResponse>> getTemplate(@PathVariable Long templateId) {
        return ResponseEntity.ok(ApiResponse.success(adminTemplateService.getTemplate(templateId)));
    }

    // POST /api/admin/templates
    @PostMapping
    public ResponseEntity<ApiResponse<AdminTemplateResponse>> createTemplate(@RequestBody AdminTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminTemplateService.createTemplate(request)));
    }

    // PATCH /api/admin/templates/{templateId}
    @PatchMapping("/{templateId}")
    public ResponseEntity<ApiResponse<AdminTemplateResponse>> updateTemplate(
            @PathVariable Long templateId,
            @RequestBody AdminTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminTemplateService.updateTemplate(templateId, request)));
    }

    // DELETE /api/admin/templates/{templateId}
    @DeleteMapping("/{templateId}")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable Long templateId) {
        adminTemplateService.deleteTemplate(templateId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // POST /api/admin/templates/{templateId}/master-invitation
    @PostMapping("/{templateId}/master-invitation")
    public ResponseEntity<ApiResponse<InvitationResponse>> getOrCreateMasterInvitation(
            @PathVariable Long templateId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                adminTemplateService.getOrCreateMasterInvitation(templateId, userDetails)));
    }
}