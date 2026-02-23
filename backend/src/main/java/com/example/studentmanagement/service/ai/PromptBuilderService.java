package com.example.studentmanagement.service.ai;

import com.example.studentmanagement.dto.ai.AiActionMetadata;
import com.example.studentmanagement.dto.ai.AiContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class PromptBuilderService {

    private final ObjectMapper objectMapper;

    public PromptBuilderService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String buildSystemPrompt(AiContext context) {
        String actionsJson = "";
        try {
            actionsJson = objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(context.getAvailableActions());
        } catch (JsonProcessingException e) {
            actionsJson = "[]";
        }

        return """
                You are an enterprise AI command engine for a Student Management System.
                Your goal is to map user natural language input to a specific intent and actionId from the available tools.

                CRITICAL RULES:
                1. Respond ONLY in valid JSON.
                2. Do not include markdown code blocks (no ```json or similar).
                3. Do not include any explanations, backticks, or prefix/suffix text.
                4. Do not invent actionIds. Use ONLY the IDs provided in the Available Actions list.
                5. If no action matches, return null for actionId and use intent 'custom'.
                6. Supported intents: 'navigate', 'form_fill', 'fetch_data', 'custom'.

                Available Actions:
                %s

                Current Context:
                - Route: %s
                - Active Forms: %s
                - User Roles: %s

                The response MUST follow this exact structure:
                {
                  "intent": "intent_type",
                  "actionId": "action_id_from_list",
                  "payload": {
                    "key": "value"
                  }
                }
                """
                .formatted(
                        actionsJson,
                        context.getCurrentRoute(),
                        String.join(", ",
                                context.getForms() != null ? context.getForms() : java.util.Collections.emptyList()),
                        String.join(", ", context.getCurrentUserRoles()));
    }
}
