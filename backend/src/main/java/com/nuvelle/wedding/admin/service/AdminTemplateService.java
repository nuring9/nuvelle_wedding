package com.nuvelle.wedding.admin.service;

import com.nuvelle.wedding.admin.dto.AdminTemplateRequest;
import com.nuvelle.wedding.admin.dto.AdminTemplateResponse;
import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.dto.InvitationResponse;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import com.nuvelle.wedding.template.entity.Template;
import com.nuvelle.wedding.template.repository.TemplateRepository;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminTemplateService {

    private final TemplateRepository templateRepository;
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Transactional(readOnly = true)
    public List<AdminTemplateResponse> getAllTemplates() {
        return templateRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(AdminTemplateResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminTemplateResponse getTemplate(Long templateId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));
        return AdminTemplateResponse.from(template);
    }

    @Transactional
    public AdminTemplateResponse createTemplate(AdminTemplateRequest request) {
        String slug = generateTemplateSlug(request.getThemeKey(), request.getName());
        Template template = Template.builder()
                .name(request.getName())
                .slug(slug)
                .thumbnailUrl(request.getThumbnailUrl())
                .previewImageUrl(request.getPreviewImageUrl())
                .themeKey(request.getThemeKey())
                .layoutKey(request.getLayoutKey())
                .description(request.getDescription())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();
        templateRepository.save(template);
        return AdminTemplateResponse.from(template);
    }

    @Transactional
    public AdminTemplateResponse updateTemplate(Long templateId, AdminTemplateRequest request) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));
        String slug = generateTemplateSlug(request.getThemeKey(), request.getName());
        template.update(
                request.getName(),
                slug,
                request.getThumbnailUrl(),
                request.getPreviewImageUrl(),
                request.getThemeKey(),
                request.getLayoutKey(),
                request.getDescription(),
                request.getActive() != null ? request.getActive() : template.isActive(),
                request.getSortOrder() != null ? request.getSortOrder() : template.getSortOrder()
        );
        return AdminTemplateResponse.from(template);
    }

    private String generateTemplateSlug(String themeKey, String name) {
        if (themeKey != null && !themeKey.isBlank()) {
            return themeKey;
        }
        // themeKey 없으면 이름을 소문자+하이픈으로 변환
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    @Transactional
    public void deleteTemplate(Long templateId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));

        long invitationCount = invitationRepository.countByTemplateId(templateId);

        if (invitationCount > 0) {
            throw new IllegalStateException("이 템플릿을 사용 중인 청첩장이 있어 삭제할 수 없습니다.");
        }

        templateRepository.delete(template);
    }


    // 마스터 청첩장 생성 또는 기존 반환
    @Transactional
    public InvitationResponse getOrCreateMasterInvitation(Long templateId, CustomUserDetails userDetails) {
        Template template = templateRepository.findByIdForUpdate(templateId)
                .orElseThrow(() -> new CustomException(ErrorCode.TEMPLATE_NOT_FOUND));

        if (template.getMasterInvitation() != null) {
            Invitation existing = invitationRepository
                    .findByIdWithGalleries(template.getMasterInvitation().getId())
                    .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));
            return InvitationResponse.from(existing, baseUrl);
        }

        User admin = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String slug = generateUniqueSlug();

        Invitation masterInvitation = Invitation.builder()
                .user(admin)
                .template(template)
                .slug(slug)
                .status(InvitationStatus.DRAFT)
                .title(template.getName() + " 마스터")
                .build();
        masterInvitation.markAsTemplateMaster();
        invitationRepository.save(masterInvitation);

        template.updateMasterInvitation(masterInvitation);

        return InvitationResponse.from(masterInvitation, baseUrl);
    }

    private String generateUniqueSlug() {
        String slug;
        do {
            slug = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (invitationRepository.existsBySlug(slug));
        return slug;
    }
}
