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
public class AiContext {
    private List<AiActionMetadata> availableActions;
    private List<String> currentUserRoles;
    private String currentRoute;
    private List<String> forms;
}
