package com.example.studentmanagement.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiResponse {

    private String intent;
    private Map<String, Object> payload;
    private String message;
}