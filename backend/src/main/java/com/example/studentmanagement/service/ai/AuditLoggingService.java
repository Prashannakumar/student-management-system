package com.example.studentmanagement.service.ai;

import com.example.studentmanagement.dto.ai.AiRequest;
import com.example.studentmanagement.dto.ai.AiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AuditLoggingService {

    /**
     * Log an AI interaction for audit and compliance.
     */
    public void logInteraction(String userId, AiRequest request, AiResponse response, long durationMs) {
        log.info(
                "AUDIT - AI_INTERACTION | User: {} | Input: {} | Action: {} | Intent: {} | Duration: {}ms | Timestamp: {}",
                userId,
                request.getUserInput(),
                response.getActionId(),
                response.getIntent(),
                durationMs,
                LocalDateTime.now());
    }

    public void logFailure(String userId, String input, String reason) {
        log.error("AUDIT - AI_FAILURE | User: {} | Input: {} | Reason: {} | Timestamp: {}",
                userId,
                input,
                reason,
                LocalDateTime.now());
    }
}
