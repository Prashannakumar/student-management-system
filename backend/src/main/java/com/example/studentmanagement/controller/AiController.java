package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.ai.AiRequest;
import com.example.studentmanagement.dto.ai.AiResponse;
import com.example.studentmanagement.service.ai.AiAgentService;
import com.example.studentmanagement.service.ai.AuditLoggingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiController {

    private final AiAgentService aiAgentService;
    private final AuditLoggingService auditLoggingService;

    @PostMapping("/ai-agent")
    public AiResponse handleAiRequest(@RequestBody AiRequest request) {
        long startTime = System.currentTimeMillis();
        String userId = getCurrentUserId();

        try {
            AiResponse response = aiAgentService.processRequest(request);

            long duration = System.currentTimeMillis() - startTime;
            auditLoggingService.logInteraction(userId, request, response, duration);

            return response;
        } catch (Exception e) {
            auditLoggingService.logFailure(userId, request.getUserInput(), e.getMessage());
            throw e;
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "anonymous";
    }
}
