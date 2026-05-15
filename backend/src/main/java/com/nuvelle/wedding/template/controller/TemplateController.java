package com.nuvelle.wedding.template.controller;

import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.template.dto.TemplateResponse;
import com.nuvelle.wedding.template.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {
    private final TemplateService templateService;

    // GET /api/templates
    // 활성화된 템플릿 목록을 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> getTemplates() {
        List<TemplateResponse> templates = templateService.getActiveTemplates();
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    // GET /api/templates/{templateId}
    // 특정 템플릿 ID에 해당하는 템플릿을 조회.
    @GetMapping("/{templateId}")
    public ResponseEntity<ApiResponse<TemplateResponse>> getTemplate(@PathVariable Long templateId ) {
        TemplateResponse template = templateService.getTemplate(templateId);
        return ResponseEntity.ok(ApiResponse.success(template));
    }
}
