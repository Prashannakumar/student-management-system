package com.example.studentmanagement.ai.service;

import com.example.studentmanagement.ai.dto.AiRequest;
import org.springframework.stereotype.Service;

@Service
public class PromptBuilder {

    public String build(AiRequest request) {

        return """
You are an enterprise AI command engine.

CRITICAL RULES:
1. You MUST choose the most semantically relevant actionId.
2. If no action matches the user request, return:
   {
     "intent": "custom",
     "actionId": null,
     "payload": { "message": "No matching action found" }
   }
3. Do NOT guess.
4. Do NOT choose unrelated actions.
5. Respond ONLY with valid JSON.
6. No markdown.
7. No explanation text.
8. If confidence is low, return intent "custom".

JSON FORMAT:

{
  "intent": "navigate | fill_form | query | custom",
  "actionId": "string or null",
  "payload": {}
}

Available Actions:
%s

User Command:
"%s"
"""
                .formatted(
                        request.getContext(),
                        request.getUserInput()
                );
    }
}