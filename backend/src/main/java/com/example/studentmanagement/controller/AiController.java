package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.ai.AiAction;
import com.example.studentmanagement.service.ai.AiAgentService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Enable CORS for Angular
public class AiController {

    private final AiAgentService aiAgentService;

    public AiController(AiAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    @PostMapping("/ai-agent")
    public AiAction processCommand(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            AiAction errorAction = new AiAction();
            errorAction.setIntent("message");
            errorAction.setText("Message is required.");
            return errorAction;
        }
        return aiAgentService.processCommand(message);
    }
}
