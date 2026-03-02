package com.example.studentmanagement.ai.service;

import com.example.studentmanagement.ai.dto.AiRequest;
import com.example.studentmanagement.ai.dto.AiResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AiResponseValidator {

    public AiResponse validate(AiResponse response, AiRequest request) {

        if (response == null) {
            return safe("respond", "AI returned empty response.");
        }

        Map<String, Object> context = request.getContext();

        if (context == null) {
            return response;
        }

        Map<String, Object> application =
                (Map<String, Object>) context.get("application");

        Map<String, Object> runtime =
                (Map<String, Object>) context.get("runtime");

        switch (response.getIntent()) {

            case "navigate":
                return validateNavigation(response, application);

            case "fill_form":
                return validateForm(response, runtime);

            default:
                return response;
        }
    }

    private AiResponse validateNavigation(
            AiResponse response,
            Map<String, Object> application
    ) {

        if (application == null) {
            return safe("respond", "Application context missing.");
        }

        if (response.getPayload() == null) {
            return safe("respond", "Missing navigation payload.");
        }

        Object routeObj = response.getPayload().get("route");

        if (!(routeObj instanceof String route) || route.isBlank()) {
            return safe("respond", "Invalid route specified.");
        }

        Object routesObj = application.get("routes");

        if (!(routesObj instanceof java.util.List<?> routes)) {
            return safe("respond", "No routes available.");
        }

        boolean exists = routes.stream()
                .filter(r -> r instanceof Map)
                .map(r -> (Map<?, ?>) r)
                .anyMatch(r -> route.equals(r.get("path")));

        if (!exists) {
            return safe("respond",
                    "Requested route does not exist.");
        }

        return response;
    }

    private AiResponse validateForm(
            AiResponse response,
            Map<String, Object> runtime
    ) {

        if (runtime == null) {
            return safe("respond", "Runtime context missing.");
        }

        if (response.getPayload() == null) {
            return safe("respond", "No form payload provided.");
        }

        Object activeFormObj = runtime.get("activeForm");

        if (!(activeFormObj instanceof Map<?, ?> activeForm)) {
            return safe("respond", "No active form available.");
        }

        Object fieldsObj = activeForm.get("fields");

        if (!(fieldsObj instanceof java.util.List<?> fields)) {
            return safe("respond", "Active form fields missing.");
        }

        for (String key : response.getPayload().keySet()) {

            boolean fieldExists = fields.stream()
                    .filter(f -> f instanceof Map)
                    .map(f -> (Map<?, ?>) f)
                    .anyMatch(f -> key.equals(f.get("id")));

            if (!fieldExists) {
                return safe("respond",
                        "Field '" + key + "' does not exist.");
            }
        }

        return response;
    }

    private AiResponse safe(String intent, String message) {
        AiResponse safe = new AiResponse();
        safe.setIntent(intent);
        safe.setMessage(message);
        safe.setPayload(null);
        return safe;
    }
}