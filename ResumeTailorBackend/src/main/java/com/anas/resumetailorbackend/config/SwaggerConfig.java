package com.anas.resumetailorbackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ResumeTailor Backend API")
                        .description("AI Resume & Cover Letter Assistant (Spring Boot + OpenAI)")
                        .version("1.0.0"));
    }
}
