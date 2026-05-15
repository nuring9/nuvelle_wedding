package com.nuvelle.wedding.template.repository;

import com.nuvelle.wedding.template.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TemplateRepository extends JpaRepository<Template, Long> {

    // 활성화된 템플릿만 조회하고 sortOrder 오름차순으로 정렬
    List<Template> findAllByIsActiveTrueOrderBySortOrderAsc();

    // id가 일치하고 활성화 상태인 템플릿을 단건 조회
    Optional<Template> findByIdAndIsActiveTrue(Long id);

    // slug 값으로 템플릿을 단건 조회
    Optional<Template> findBySlug(String slug);
}
