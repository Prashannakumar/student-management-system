package com.example.studentmanagement.model.ai;

import lombok.Data;
import java.util.List;

@Data
public class GeminiModels {

    @Data
    public static class Request {
        private List<Content> contents;
    }

    @Data
    public static class Response {
        private List<Candidate> candidates;
    }

    @Data
    public static class Content {
        private List<Part> parts;
    }

    @Data
    public static class Part {
        private String text;
    }

    @Data
    public static class Candidate {
        private Content content;
    }
}
