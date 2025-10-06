package com.anas.resumetailorbackend.controller;

import com.anas.resumetailorbackend.service.ChatGptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestingController {
    private final ChatGptService chatGptService;

    /**
     * Test endpoint to verify OpenAI connection.
     * Accessible from Swagger at POST /api/test
     */
//    @PostMapping("/test")
//    public ChatGptResponse testChat(@RequestBody ChatGptRequest request) {
//        String reply = chatGptService.getCompletion(request.getPrompt());
//        return new ChatGptResponse(reply);
//    }
}