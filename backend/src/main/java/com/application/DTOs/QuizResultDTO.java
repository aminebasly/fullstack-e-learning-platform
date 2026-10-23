package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class QuizResultDTO {
    private String email;
    private int score;
    private String level;
    private String accessType;

    // getters and setters
}

