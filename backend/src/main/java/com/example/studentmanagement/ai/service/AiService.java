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
    private final AiResponseValidator validator;

    public AiResponse process(AiRequest request) {

        try {

            // 1️⃣ Build Prompt
            String prompt = promptBuilder.build(request);

            // 2️⃣ Call Gemini
            String rawResponse = geminiClient.generate(prompt);

            // 3️⃣ Extract JSON
            String cleaned = extractJson(rawResponse);

            // 4️⃣ Deserialize
            AiResponse aiResponse =
                    objectMapper.readValue(cleaned, AiResponse.class);

            // 5️⃣ Deterministic Validation Layer
            AiResponse validated =
                    validator.validate(aiResponse, request);

            return validated;

        } catch (Exception e) {

            return safeResponse(
                    "respond",
                    "AI processing failed: " + e.getMessage()
            );
        }
    }

    private String extractJson(String raw) {

        if (raw == null) return "{}";

        int start = raw.indexOf("{");
        int end = raw.lastIndexOf("}") + 1;

        if (start >= 0 && end > start) {
            return raw.substring(start, end);
        }

        return "{}";
    }

    private AiResponse safeResponse(String intent, String message) {
        AiResponse response = new AiResponse();
        response.setIntent(intent);
        response.setMessage(message);
        response.setPayload(null);
        return response;
    }
}