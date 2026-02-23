package com.example.studentmanagement.ai.service;

import com.example.studentmanagement.ai.dto.AiRequest;
import org.springframework.stereotype.Service;

@Service
public class PromptBuilder {

    public String build(AiRequest request) {
        Object activeForm = request.getContext().get("activeForm");
        return """
You are an enterprise AI command engine.

CRITICAL RULES:

1. You MUST only use actionIds from Available Actions.
2. You MUST only use field ids from Active Form Fields.
3. If user wants navigation → return intent "navigate".
4. If user wants to fill a form → return intent "fill_form".
5. If no action or field matches → return intent "custom".
6. DO NOT invent fields.
7. DO NOT invent actions.
8. Respond ONLY with valid JSON.
9. No markdown.
10. No explanations.

JSON FORMAT:

{
  "intent": "navigate | fill_form | custom",
  "actionId": "string or null",
  "payload": {}
}

Available Actions:
%s

Active Form Fields:
%s

User Command:
"%s"
"""
                .formatted(
                        request.getContext().get("availableActions"),
                        activeForm,
                        request.getUserInput()
                );
    }
}