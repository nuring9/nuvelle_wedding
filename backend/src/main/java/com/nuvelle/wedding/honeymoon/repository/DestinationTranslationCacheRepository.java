package com.nuvelle.wedding.honeymoon.repository;

import com.nuvelle.wedding.honeymoon.entity.DestinationTranslationCache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DestinationTranslationCacheRepository
        extends JpaRepository<DestinationTranslationCache, Long> {

    Optional<DestinationTranslationCache> findByUserIdAndSourceText(Long userId, String sourceText);
}
