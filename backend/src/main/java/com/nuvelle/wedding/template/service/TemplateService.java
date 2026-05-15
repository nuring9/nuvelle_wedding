package com.nuvelle.wedding.template.service;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.template.dto.TemplateResponse;
import com.nuvelle.wedding.template.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TemplateService {
 private final TemplateRepository templateRepository;

 @Transactional(readOnly = true)
    public List<TemplateResponse> getActiveTemplates() {
     // 활성화된 템플릿 목록을 sortOrder 오름차순으로 조회
     return templateRepository.findAllByIsActiveTrueOrderBySortOrderAsc()
             .stream()
             .map(TemplateResponse::from)
             .collect(Collectors.toList());
 }

 @Transactional(readOnly = true)
    public TemplateResponse getTemplate(Long templateId) {
     // ID가 일치하고 활성화된 템플릿을 조회.
     return templateRepository.findByIdAndIsActiveTrue(templateId)
             .map(TemplateResponse::from)
             .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));
 }
}
