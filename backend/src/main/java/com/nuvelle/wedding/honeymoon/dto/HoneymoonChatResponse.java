package com.nuvelle.wedding.honeymoon.dto;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonChatMessage;
import com.nuvelle.wedding.honeymoon.entity.MessageRole;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HoneymoonChatResponse {

    private Long id;
    private MessageRole role;
    private String content;
    private LocalDateTime createdAt;

    public static HoneymoonChatResponse from(HoneymoonChatMessage message) {
        return HoneymoonChatResponse.builder()
                .id(message.getId())
                .role(message.getRole())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}