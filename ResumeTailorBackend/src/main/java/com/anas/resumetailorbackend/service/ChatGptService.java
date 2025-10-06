package com.anas.resumetailorbackend.service;

import com.anas.resumetailorbackend.model.TailorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatGptService {

    private final WebClient webClient;
    private final PdfExtractorService pdfExtractorService;

    @Value("${openai.model}")
    private String model;

    // 🔹 New constant for validation
    private static final int MAX_TEXT_LENGTH = 8000;

    /**
     * Handles a tailoring request when the user uploads a PDF resume.
     */
    public TailorResponse handleTailorFile(MultipartFile resumeFile, String jobDescription) {
        if (resumeFile == null || resumeFile.isEmpty()) {
            log.warn("❌ No PDF file provided by user.");
            throw new IllegalArgumentException("No PDF file provided.");
        }

        try {
            log.info("📄 Processing uploaded PDF resume: {}", resumeFile.getOriginalFilename());
            String extractedText = pdfExtractorService.extractText(resumeFile);
            log.debug("✅ Extracted {} characters of text from PDF.", extractedText.length());
            // 🔹 Validate both extracted resume text and job description
            validateInputLength(extractedText, jobDescription);
            return runTailoringSystem(extractedText, jobDescription);
        } catch (Exception e) {
            log.error("⚠️ Failed to extract text from PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Error extracting text from PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Handles a tailoring request when the user pastes resume text directly.
     */
    public TailorResponse handleTailorText(String resumeText, String jobDescription) {
        if (resumeText == null || resumeText.isBlank()) {
            log.warn("❌ Empty resume text received.");
            throw new IllegalArgumentException("Resume text cannot be empty.");
        }

        // 🔹 Validate text length before continuing
        validateInputLength(resumeText, jobDescription);

        log.info("✏️ Received resume text input ({} characters).", resumeText.length());
        return runTailoringSystem(resumeText.trim(), jobDescription);
    }

    /**
     * Validates resume and job description text length.
     */
    private void validateInputLength(String resumeText, String jobDescription) {
        if (resumeText != null && resumeText.length() > MAX_TEXT_LENGTH) {
            log.warn("⚠️ Resume text too long: {} characters.", resumeText.length());
            throw new IllegalArgumentException("Resume text too long. Please shorten your resume (max 8000 characters).");
        }
        if (jobDescription != null && jobDescription.length() > MAX_TEXT_LENGTH) {
            log.warn("⚠️ Job description too long: {} characters.", jobDescription.length());
            throw new IllegalArgumentException("Job description too long. Please shorten it (max 8000 characters).");
        }
    }

    /**
     * Loads the prompt template, fills placeholders, sends to OpenAI, and parses the reply.
     */
    private TailorResponse runTailoringSystem(String resumeText, String jobDescription) {
        log.info("🤖 Starting AI tailoring process using model: {}", model);

        InputStream stream = getClass().getClassLoader()
                .getResourceAsStream("prompts/resume_tailor_prompt.txt");

        if (stream == null) {
            log.error("❌ Prompt file not found in /resources/prompts/");
            throw new IllegalStateException("Prompt file not found in /resources/prompts/");
        }

        try {
            String basePrompt = StreamUtils.copyToString(stream, StandardCharsets.UTF_8);

            String finalPrompt = basePrompt
                    .replaceFirst("%s", Matcher.quoteReplacement(jobDescription))
                    .replaceFirst("%s", Matcher.quoteReplacement(resumeText));

            log.debug("📨 Sending prompt to OpenAI ({} characters).", finalPrompt.length());

            String reply = getCompletion(finalPrompt);
            log.debug("📩 Received reply from OpenAI ({} characters).", reply.length());

            TailorResponse result = parseTailorResponse(reply);
            log.info("✅ Tailoring process completed successfully.");

            return result;

        } catch (Exception e) {
            log.error("⚠️ Tailoring failed: {}", e.getMessage(), e);
            throw new RuntimeException("Tailoring failed: " + e.getMessage(), e);
        }
    }

    /**
     * Sends the prompt to OpenAI and retrieves the assistant's reply text.
     */
    private String getCompletion(String prompt) {
        log.info("🔗 Sending request to OpenAI API (model: {})", model);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );

        Map<?, ?> response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || response.get("choices") == null) {
            log.error("❌ No response received from OpenAI.");
            throw new RuntimeException("No response from OpenAI.");
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices.isEmpty()) {
            log.error("❌ Empty 'choices' list in OpenAI response.");
            throw new RuntimeException("No choices returned from OpenAI.");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> message = (Map<String, Object>) choices.getFirst().get("message");
        String content = message.get("content").toString().trim();

        log.debug("🧠 OpenAI raw response (first 200 chars): {}",
                content.substring(0, Math.min(200, content.length())).replaceAll("\\s+", " "));

        return content;
    }

    /**
     * Splits GPT's output into the 4 required sections.
     */
    private TailorResponse parseTailorResponse(String text) {
        log.debug("📖 Parsing AI response into 4 sections...");

        String jobPostingAnalysis = extractSection(text, "1\\)", "2\\)");
        String coverLetter = extractSection(text, "2\\)", "3\\)");
        String resumeTailoring = extractSection(text, "3\\)", "4\\)");
        String additionalQualifications = extractSection(text, "4\\)", "$");

        return new TailorResponse(
                jobPostingAnalysis.trim(),
                coverLetter.trim(),
                resumeTailoring.trim(),
                additionalQualifications.trim()
        );
    }

    /**
     * Extracts text between two numbered section markers.
     */
    private String extractSection(String text, String startMarker, String endMarker) {
        Pattern pattern = Pattern.compile(startMarker + "(.*?)" + endMarker, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text + "\n");
        return matcher.find() ? matcher.group(1) : "";
    }
}
