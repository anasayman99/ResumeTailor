package com.anas.resumetailorbackend.exception;

import com.anas.resumetailorbackend.model.TailorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles all uncaught exceptions in the backend.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<TailorResponse> handleGeneralException(Exception ex) {
        log.error("❌ Unhandled exception: {}", ex.getMessage(), ex);
        TailorResponse errorResponse = new TailorResponse(
                "Server Error: " + ex.getMessage(),
                "",
                "",
                ""
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles invalid argument exceptions (e.g. nulls, missing parts, etc.)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<TailorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("⚠️ Invalid request: {}", ex.getMessage());
        TailorResponse response = new TailorResponse("Invalid input: " + ex.getMessage(), "", "", "");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles validation errors (from @Valid annotations if added later)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<TailorResponse> handleValidationError(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        log.warn("⚠️ Validation error: {}", errorMsg);
        TailorResponse response = new TailorResponse("Validation error: " + errorMsg, "", "", "");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles large file upload errors.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<TailorResponse> handleFileSizeExceeded(MaxUploadSizeExceededException ex) {
        log.warn("⚠️ File too large: {}", ex.getMessage());
        TailorResponse response = new TailorResponse("File too large. Maximum allowed size is 10 MB.", "", "", "");
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }

}
