package com.nuvelle.wedding.honeymoon.repository;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoneymoonChatMessageRepository
        extends JpaRepository<HoneymoonChatMessage, Long> {

    // 플랜별 대화 내역 시간순 조회
    List<HoneymoonChatMessage> findAllByPlanIdOrderByCreatedAtAsc(Long planId);

    // 최근 N개 메시지만 조회 (AI 컨텍스트 전달용)
    List<HoneymoonChatMessage> findTop10ByPlanIdOrderByCreatedAtDesc(Long planId);

    Optional<HoneymoonChatMessage> findByIdAndPlanId(Long id, Long planId);

    void deleteAllByPlanId(Long planId);
}
