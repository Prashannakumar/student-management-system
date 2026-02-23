package com.example.studentmanagement.service.ai.impl;

import com.example.studentmanagement.model.ai.GeminiModels;
import com.example.studentmanagement.service.ai.AiProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;

@Service
public class GeminiAiProvider implements AiProvider {

    private final RestTemplate restTemplate;

    @Value("${gemini.api.key: api-key }")
    private String apiKey;

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public GeminiAiProvider(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String generateResponse(String prompt) {
        String url = API_URL + "?key=" + apiKey;

        GeminiModels.Part part = new GeminiModels.Part();
        part.setText(prompt);

        GeminiModels.Content content = new GeminiModels.Content();
        content.setParts(Collections.singletonList(part));

        GeminiModels.Request request = new GeminiModels.Request();
        request.setContents(Collections.singletonList(content));

        try {
            GeminiModels.Response response = restTemplate.postForObject(url, request, GeminiModels.Response.class);
            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                return response.getCandidates().get(0).getContent().getParts().get(0).getText();
            }
        } catch (Exception e) {
            return "{\"intent\": \"message\", \"text\": \"Error calling AI provider: " + e.getMessage() + "\"}";
        }

        return "{\"intent\": \"message\", \"text\": \"No response from AI provider.\"}";
    }
}
