package com.example.studentmanagement;

import com.example.studentmanagement.ai.client.GeminiClient;
import com.example.studentmanagement.config.GeminiProperties;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class StudentManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentManagementSystemApplication.class, args);
	}

    // for testing - remove below
    @Bean
    CommandLineRunner test(GeminiProperties props) {
        return args -> {
            System.out.println("Model: " + props.getModel());
            System.out.println("API Key Loaded: " + (props.getApiKey() != null));
        };
    }

    @Bean
    CommandLineRunner testGemini(GeminiClient client) {
        return args -> {
            String result = client.generate("Say hello in one word.");
            System.out.println("Gemini Response: " + result);
        };
    }
    // for testing - remove above

}
