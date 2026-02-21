package com.example.studentmanagement.model.ai;

import lombok.Data;
import java.util.List;

@Data
public class AppConfig {
    private String appName;
    private List<RouteConfig> routes;
    private List<String> supportedActions;
    private List<String> systemInstructions;

    @Data
    public static class RouteConfig {
        private String path;
        private String description;
    }
}
