package com.example.studentmanagement.service.ai;

import com.example.studentmanagement.dto.ai.AiActionMetadata;
import com.example.studentmanagement.dto.ai.AiRequest;
import com.example.studentmanagement.dto.ai.AiResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class AiAgentService {

    private final AiProvider aiProvider;
    private final PromptBuilderService promptBuilder;
    private final ObjectMapper objectMapper;

    public AiAgentService(AiProvider aiProvider, PromptBuilderService promptBuilder, ObjectMapper objectMapper) {
        this.aiProvider = aiProvider;
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
    }

    public AiResponse processRequest(AiRequest request) {
        log.info("Processing AI request for input: {}", request.getUserInput());

        // 1. Build prompt
        String prompt = promptBuilder.buildSystemPrompt(request.getContext());
        String fullPrompt = prompt + "\\\nUser Input: " + request.getUserInput();

        // 2. Call AI Provider
        String rawResponse = aiProvider.generate(fullPrompt);
        log.debug("Raw AI Response: {}", rawResponse);

        // 3. Extract and parse JSON
        AiResponse response = parseAndValidate(rawResponse, request);

        // 4. Security Check (RBAC)
        return validateAuthorization(response, request);
    }

    private AiResponse parseAndValidate(String rawResponse, AiRequest request) {
        try {
            // Clean markdown if AI ignored instructions
            String cleanedJson = rawResponse.replaceAll("```json", "").replaceAll("```", "").trim();
            AiResponse aiResponse = objectMapper.readValue(cleanedJson, AiResponse.class);
            return aiResponse;
        } catch (JsonProcessingException e) {
            log.error("Failed to parse AI response: {}. Error: {}", rawResponse, e.getMessage());
            return AiResponse.builder()
                    .intent("custom")
                    .payload(Map.of("message", "Failed to parse AI response. Please try again."))
                    .build();
        }
    }

    private AiResponse validateAuthorization(AiResponse response, AiRequest request) {
        if (response.getActionId() == null) {
            return response;
        }

        // Verify action exists in provided context
        Optional<AiActionMetadata> actionMetadata = request.getContext().getAvailableActions().stream()
                .filter(a -> a.getId().equals(response.getActionId()))
                .findFirst();

        if (actionMetadata.isEmpty()) {
            log.warn("AI suggested invalid actionId: {}", response.getActionId());
            return buildUnauthorizedResponse("Invalid action suggested by AI.");
        }

        // Verify user roles
        String requiredRole = actionMetadata.get().getRequiredRole();
        if (requiredRole != null && !request.getContext().getCurrentUserRoles().contains(requiredRole)) {
            log.warn("AI suggested unauthorized actionId: {} for user roles: {}",
                    response.getActionId(), request.getContext().getCurrentUserRoles());
            return buildUnauthorizedResponse("Unauthorized to perform this action.");
        }

        return response;
    }

    private AiResponse buildUnauthorizedResponse(String message) {
        return AiResponse.builder()
                .intent("custom")
                .actionId(null)
                .payload(Map.of("message", message))
                .build();
    }
}
