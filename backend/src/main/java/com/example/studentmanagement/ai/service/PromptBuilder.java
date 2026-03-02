package com.example.studentmanagement.ai.service;

import com.example.studentmanagement.ai.dto.AiRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PromptBuilder {

    private final ObjectMapper objectMapper;

    public PromptBuilder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String build(AiRequest request) {

        Map<String, Object> context = request.getContext();

        Object application = context.get("application");
        Object runtime = context.get("runtime");

        String applicationJson = toJson(application);
        String runtimeJson = toJson(runtime);

        return """
You are an enterprise-grade AI execution engine for a web application.

You receive structured application context and runtime state.

=============================
APPLICATION CONTEXT
=============================
%s

=============================
RUNTIME STATE
=============================
%s

=============================
STRICT RULES
=============================

1. Only navigate to routes listed in application.routes.
2. If a route is guarded and user roles do not match, do NOT navigate.
3. Only fill fields listed in runtime.activeForm.fields.
4. If runtime.activeForm.valid is false and user requests submission, fix validation first.
5. If runtime.lastExecutionError exists, analyze it and correct the action.
6. NEVER invent routes.
7. NEVER invent fields.
8. NEVER invent actions.
9. If nothing matches → respond with intent "respond".
10. Output MUST be valid JSON only.
11. No markdown.
12. No explanations.
13. When navigating, route MUST exactly match one of application.routes.path values.

=============================
ALLOWED INTENTS
=============================

navigate
fill_form
submit_form
fetch_data
respond

=============================
RESPONSE FORMAT (STRICT)
=============================

If intent = "navigate":
{
  "intent": "navigate",
  "payload": {
    "route": "/exact-route-from-application.routes"
  },
  "message": null
}

If intent = "fill_form":
{
  "intent": "fill_form",
  "payload": {
    "fieldId": "value"
  },
  "message": null
}

If intent = "submit_form":
{
  "intent": "submit_form",
  "payload": {},
  "message": null
}

If intent = "fetch_data":
{
  "intent": "fetch_data",
  "payload": {
    "endpoint": "string",
    "params": {}
  },
  "message": null
}

If intent = "respond":
{
  "intent": "respond",
  "payload": null,
  "message": "short explanation"
}

CRITICAL:
- You MUST include payload.
- You MUST include route when navigating.
- You MUST copy route exactly from application.routes.
- Do not remove leading slash.
- Do not paraphrase route.
- Output ONLY JSON.

=============================
USER COMMAND
=============================

"%s"
"""
                .formatted(
                        applicationJson,
                        runtimeJson,
                        request.getUserInput()
                );
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}