package com.example.studentmanagement.service.ai;

import com.example.studentmanagement.model.ai.AppConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.stream.Collectors;

@Service
public class PromptBuilderService {

    private final ObjectMapper objectMapper;
    private AppConfig appConfig;

    public PromptBuilderService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() throws IOException {
        ClassPathResource resource = new ClassPathResource("ai-config.json");
        this.appConfig = objectMapper.readValue(resource.getInputStream(), AppConfig.class);
    }

    public String buildPrompt(String userMessage) {
        StringBuilder prompt = new StringBuilder();

        // System Instructions
        prompt.append("SYSTEM INSTRUCTIONS:\n");
        appConfig.getSystemInstructions().forEach(inst -> prompt.append("- ").append(inst).append("\n"));

        // Context
        prompt.append("\nAPPLICATION CONTEXT:\n");
        prompt.append("App Name: ").append(appConfig.getAppName()).append("\n");
        prompt.append("Supported Routes:\n");
        appConfig.getRoutes().forEach(route -> prompt.append("- ").append(route.getPath()).append(" (")
                .append(route.getDescription()).append(")\n"));

        prompt.append("\nSupported Actions: ").append(String.join(", ", appConfig.getSupportedActions())).append("\n");

        prompt.append(
                "\nFinal Rule: Respond ONLY with a valid JSON object. No backticks, no markdown, no explanation, no text before or after the JSON.\n");
        prompt.append("USER COMMAND: ").append(userMessage).append("\n");
        prompt.append("EXPECTED JSON OUTPUT: ");

        return prompt.toString();
    }
}
