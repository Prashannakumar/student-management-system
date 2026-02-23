package com.example.studentmanagement.ai.service;

import com.example.studentmanagement.ai.client.GeminiClient;
import com.example.studentmanagement.ai.dto.AiRequest;
import com.example.studentmanagement.ai.dto.AiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiService {

    private final GeminiClient geminiClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    public AiResponse process(AiRequest request) {

        String prompt = promptBuilder.build(request);

        String rawResponse = geminiClient.generate(prompt);

        try {
            String cleaned = extractJson(rawResponse);
            AiResponse response = objectMapper.readValue(cleaned, AiResponse.class);

            // 🔒 SECURITY CHECK
            if (!isValidAction(response.getActionId(), request)) {
                return new AiResponse(
                        "custom",
                        null,
                        java.util.Map.of("message", "Invalid or unauthorized action")
                );
            }

            return response;

        } catch (Exception e) {
            return new AiResponse(
                    "custom",
                    null,
                    java.util.Map.of("message", "AI response parsing failed")
            );
        }
    }

    private String extractJson(String raw) {
        int start = raw.indexOf("{");
        int end = raw.lastIndexOf("}") + 1;
        if (start >= 0 && end > start) {
            return raw.substring(start, end);
        }
        return raw;
    }

    private boolean isValidAction(String actionId, AiRequest request) {

        if (actionId == null) {
            return false;
        }

        Object actionsObj = request.getContext().get("availableActions");

        if (!(actionsObj instanceof java.util.List<?> actions)) {
            return false;
        }

        for (Object obj : actions) {
            if (obj instanceof java.util.Map<?, ?> map) {
                Object id = map.get("id");
                if (actionId.equals(id)) {
                    return true;
                }
            }
        }

        return false;
    }
}