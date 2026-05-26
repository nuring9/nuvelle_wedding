package com.nuvelle.wedding.honeymoon.service;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.honeymoon.ai.GeminiClient;
import com.nuvelle.wedding.honeymoon.entity.DestinationTranslationCache;
import com.nuvelle.wedding.honeymoon.repository.DestinationTranslationCacheRepository;
import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DestinationTranslateService {

    private final DestinationTranslationCacheRepository cacheRepository;
    private final UserRepository userRepository;
    private final GeminiClient geminiClient;

    @Transactional
    public String getEnglishDestinationQuery(String destination,
                                             CustomUserDetails userDetails) {
        String normalized = normalize(destination);

        return cacheRepository.findByUserIdAndSourceText(userDetails.getUserId(), normalized)
                .map(DestinationTranslationCache::getEnglishQuery)
                .orElseGet(() -> translateAndCache(normalized, userDetails.getUserId()));
    }

    private String translateAndCache(String normalizedDestination, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String englishQuery = translateWithGemini(normalizedDestination);

        cacheRepository.save(
                DestinationTranslationCache.builder()
                        .user(user)
                        .sourceText(normalizedDestination)
                        .englishQuery(englishQuery)
                        .build()
        );

        return englishQuery;
    }

    private String translateWithGemini(String destination) {
        String prompt = """
                Convert the following travel destination into a concise English Unsplash image search query
                that finds a representative travel photo of that place.
                
                Rules:
                - Return only English text.
                - Do not include explanations.
                - Use the official or commonly used English place name.
                - Include country or region if helpful.
                - Add one representative visual keyword only if it clearly improves the result.
                - Do not add generic words like travel, destination, landscape, honeymoon, photo.
                - Keep it under 8 words.
                
                Destination: %s
                """.formatted(destination);

        String translated = geminiClient.call(prompt)
                .replace("\"", "")
                .replace("`", "")
                .replace("\n", " ")
                .trim();

        return translated.isBlank() ? destination : translated;
    }

    private String normalize(String destination) {
        return destination.trim().replaceAll("\\s+", " ");
    }
}
