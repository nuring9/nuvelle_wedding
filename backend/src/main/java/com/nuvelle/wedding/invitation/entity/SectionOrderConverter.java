package com.nuvelle.wedding.invitation.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Converter
public class SectionOrderConverter implements AttributeConverter<List<String>, String> {

    @Override
    public String convertToDatabaseColumn(List<String> sectionOrder) {
        if (sectionOrder == null) {
            return null;
        }

        return sectionOrder.stream()
                .map(this::toJsonString)
                .collect(java.util.stream.Collectors.joining(",", "[", "]"));
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return List.of();
        }

        String trimmed = dbData.trim();

        if (trimmed.startsWith("[")) {
            return parseJsonStringArray(trimmed);
        }

        return Arrays.stream(trimmed.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();
    }

    private String toJsonString(String value) {
        if (value == null) {
            return "\"\"";
        }

        return "\"" + value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t") + "\"";
    }

    private List<String> parseJsonStringArray(String json) {
        List<String> values = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inString = false;
        boolean escaping = false;

        for (int i = 1; i < json.length() - 1; i++) {
            char character = json.charAt(i);

            if (!inString) {
                if (character == '"') {
                    inString = true;
                    current.setLength(0);
                }
                continue;
            }

            if (escaping) {
                current.append(switch (character) {
                    case 'n' -> '\n';
                    case 'r' -> '\r';
                    case 't' -> '\t';
                    default -> character;
                });
                escaping = false;
                continue;
            }

            if (character == '\\') {
                escaping = true;
                continue;
            }

            if (character == '"') {
                values.add(current.toString());
                inString = false;
                continue;
            }

            current.append(character);
        }

        return values;
    }
}
