package com.example.studentmanagement.ai.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AiRequest {

    private String userInput;

    // context coming from frontend (available actions, page info, etc.)
    private Map<String, Object> context;
}