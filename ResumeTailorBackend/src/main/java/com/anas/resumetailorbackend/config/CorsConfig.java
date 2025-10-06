package com.anas.resumetailorbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")                      // applies to all endpoints
                        .allowedOrigins(allowedOrigin) // allow React dev server
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // HTTP verbs allowed
                        .allowedHeaders("*");                    // allow all headers
            }
        };
    }
}
