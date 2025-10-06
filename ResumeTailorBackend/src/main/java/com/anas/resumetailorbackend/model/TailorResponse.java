package com.anas.resumetailorbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TailorResponse {
    private String jobPostingAnalysis;
    private String coverLetter;
    private String resumeTailoring;
    private String additionalQualifications;
}
