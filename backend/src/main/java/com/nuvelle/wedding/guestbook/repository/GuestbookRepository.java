package com.nuvelle.wedding.guestbook.repository;

import com.nuvelle.wedding.guestbook.entity.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestbookRepository extends JpaRepository<Guestbook, Long> {

    // 공개용: 숨김 처리 안 된 것만
    List<Guestbook> findAllByInvitationIdAndIsHiddenFalseOrderByCreatedAtDesc(Long invitationId);

    // 작성자용: 전체
    List<Guestbook> findAllByInvitationIdOrderByCreatedAtDesc(Long invitationId);
}