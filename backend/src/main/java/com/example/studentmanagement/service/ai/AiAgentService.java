package com.example.studentmanagement.service.ai;

import com.example.studentmanagement.model.ai.AiAction;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {

    private final PromptBuilderService promptBuilder;
    private final AiProvider aiProvider;
    private final ObjectMapper objectMapper;

    public AiAgentService(PromptBuilderService promptBuilder, AiProvider aiProvider, ObjectMapper objectMapper) {
        this.promptBuilder = promptBuilder;
        this.aiProvider = aiProvider;
        this.objectMapper = objectMapper;
    }

    public AiAction processCommand(String userMessage) {
        String prompt = promptBuilder.buildPrompt(userMessage);
        String rawResponse = aiProvider.generateResponse(prompt);

        // Pre-clean: Remove markdown blocks
        String cleanResponse = rawResponse.replaceAll("```json", "").replaceAll("```", "").trim();

        // Robust JSON extraction: Find the first '{' and its matching '}'
        int firstBrace = cleanResponse.indexOf('{');
        if (firstBrace != -1) {
            int braceCount = 0;
            int lastBrace = -1;
            for (int i = firstBrace; i < cleanResponse.length(); i++) {
                if (cleanResponse.charAt(i) == '{')
                    braceCount++;
                else if (cleanResponse.charAt(i) == '}')
                    braceCount--;

                if (braceCount == 0) {
                    lastBrace = i;
                    break;
                }
            }
            if (lastBrace != -1) {
                cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
            }
        }

        try {
            // Configure mapper to be more resilient
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
            objectMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
            objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                    false);

            return objectMapper.readValue(cleanResponse, AiAction.class);
        } catch (Exception e) {
            System.err.println("--- AI PARSING ERROR ---");
            System.err.println("Raw response from AI: " + rawResponse);
            System.err.println("Extracted JSON: " + cleanResponse);
            System.err.println("ErrorMessage: " + e.getMessage());
            System.err.println("-------------------------");

            AiAction errorAction = new AiAction();
            errorAction.setIntent("message");
            errorAction.setText("Failed to parse AI response. See backend logs for raw output.");
            return errorAction;
        }
    }
}
