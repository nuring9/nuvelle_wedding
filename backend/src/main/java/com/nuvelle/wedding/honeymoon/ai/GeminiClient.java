package com.nuvelle.wedding.honeymoon.ai;


import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;


import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class GeminiClient {

    private static final int MAX_RETRY_COUNT = 3;
    private static final long RETRY_DELAY_MILLIS = 800;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    public String call(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 8192
                )
        );

        for (int attempt = 1; attempt <= MAX_RETRY_COUNT; attempt++) {
            try {
                Map<String, Object> response = requestGemini(requestBody);
                return extractText(response);
            } catch (WebClientResponseException e) {
                int statusCode = e.getStatusCode().value();

                if (isTemporaryFailure(statusCode) && attempt < MAX_RETRY_COUNT) {
                    log.warn(
                            "Gemini API 일시 실패. 재시도합니다. attempt={}/{}, status={}",
                            attempt,
                            MAX_RETRY_COUNT,
                            statusCode
                    );
                    sleepBeforeRetry(attempt);
                    continue;
                }

                log.error(
                        "Gemini API 호출 실패. status={}, body={}",
                        statusCode,
                        e.getResponseBodyAsString(),
                        e
                );

                if (isTemporaryFailure(statusCode)) {
                    throw new CustomException(ErrorCode.AI_SERVICE_UNAVAILABLE);
                }

                throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
            } catch (CustomException e) {
                throw e;
            } catch (Exception e) {
                log.error("Gemini API 호출 실패", e);
                throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
            }
        }

        throw new CustomException(ErrorCode.AI_SERVICE_UNAVAILABLE);
    }

    private Map<String, Object> requestGemini(Map<String, Object> requestBody) {
        Map<String, Object> response = webClient.post()
                .uri("/v1beta/models/{model}:generateContent?key={apiKey}",
                        model, apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new RuntimeException("Gemini API 응답이 없습니다.");
        }

        return response;
    }

    private String extractText(Map<String, Object> response) {
        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            throw new RuntimeException("Gemini API 응답 candidates가 비어있습니다.");
        }

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        return (String) parts.get(0).get("text");
    }

    private boolean isTemporaryFailure(int statusCode) {
        return statusCode == 429 || statusCode == 503 || statusCode >= 500;
    }

    private void sleepBeforeRetry(int attempt) {
        try {
            Thread.sleep(RETRY_DELAY_MILLIS * attempt);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new CustomException(ErrorCode.AI_SERVICE_UNAVAILABLE);
        }
    }
}
