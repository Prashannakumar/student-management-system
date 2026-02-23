package com.example.studentmanagement.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiActionMetadata {
    private String id;
    private String description;
    private String requiredRole;
    private List<AiActionParameter> parameters;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiActionParameter {
        private String name;
        private String type; // string, number, boolean, object
        private String description;
        private boolean required;
    }
}
