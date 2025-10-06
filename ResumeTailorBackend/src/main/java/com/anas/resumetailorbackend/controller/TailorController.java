package com.anas.resumetailorbackend.controller;

import com.anas.resumetailorbackend.model.TailorResponse;
import com.anas.resumetailorbackend.service.ChatGptService;
import com.anas.resumetailorbackend.service.PdfExtractorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TailorController {

    private final ChatGptService chatGptService;
    private final PdfExtractorService pdfExtractorService;

    /**
     * Upload a PDF resume and job description and get 4 tailored outputs.
     */
    @PostMapping(value = "/tailor/file", consumes = {"multipart/form-data"})
    public TailorResponse tailorWithFile(
            @RequestPart("file") MultipartFile resumeFile,
            @RequestPart("jobDescription") String jobDescription
    ) {
        return chatGptService.handleTailorFile(resumeFile, jobDescription);
    }

    @PostMapping(value = "/tailor/text", consumes = {"multipart/form-data"})
    public TailorResponse tailorWithText(
            @RequestPart("text") String resumeText,
            @RequestPart("jobDescription") String jobDescription
    ) {
        return chatGptService.handleTailorText(resumeText, jobDescription);
    }
}
