package com.example.studentmanagement.ai.controller;

import com.example.studentmanagement.ai.dto.AiRequest;
import com.example.studentmanagement.ai.dto.AiResponse;
import com.example.studentmanagement.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-agent")
@RequiredArgsConstructor
@CrossOrigin
public class AiController {

    private final AiService aiService;

    @PostMapping
    public ResponseEntity<AiResponse> handle(@RequestBody AiRequest request) {
        AiResponse response = aiService.process(request);
        return ResponseEntity.ok(response);
    }
}