package com.example.studentmanagement.ai.client;

import com.example.studentmanagement.config.GeminiProperties;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiClient {

    private final Client client;
    private final GeminiProperties properties;

    public GeminiClient(GeminiProperties properties) {
        this.properties = properties;

        this.client = Client.builder()
                .apiKey(properties.getApiKey())
                .build();
    }

    public String generate(String prompt) {

        GenerateContentResponse response =
                client.models.generateContent(
                        properties.getModel(),
                        prompt,
                        null
                );

        return response.text();
    }
}