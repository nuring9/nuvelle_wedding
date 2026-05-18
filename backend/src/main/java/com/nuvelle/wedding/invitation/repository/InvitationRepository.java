package com.nuvelle.wedding.invitation.repository;

import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    // 내 청첩장 목록 (최신순)
    List<Invitation> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    // slug로 공개 청첩장 조회
    Optional<Invitation> findBySlugAndStatus(String slug, InvitationStatus status);

    // slug 중복 확인
    boolean existsBySlug(String slug);

    // 작성자 + id 로 단건 조회 (갤러리 fetch join)
    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.galleries WHERE i.id = :id")
    Optional<Invitation> findByIdWithGalleries(@Param("id") Long id);

    // 공개 청첩장 slug 조회 (갤러리 fetch join)
    @Query("SELECT i FROM Invitation i LEFT JOIN FETCH i.galleries WHERE i.slug = :slug AND i.status = 'PUBLISHED'")
    Optional<Invitation> findPublishedBySlugWithGalleries(@Param("slug") String slug);
}
