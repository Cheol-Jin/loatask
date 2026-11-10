package com.example.vuespringlabbackend.lostark.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CharacterProfileException extends RuntimeException {

    private final HttpStatus status;
    private final String code;
    private final boolean retryable;

    public CharacterProfileException(HttpStatus status, String code, String message) {
        this(status, code, message, false);
    }

    public CharacterProfileException(HttpStatus status, String code, String message, boolean retryable) {
        super(message);
        this.status = status;
        this.code = code;
        this.retryable = retryable;
    }
}
