package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
class UserProgressDTO {
    private String userEmail;
    private Long contentId;
    private boolean completed;
    private Integer score;
    private LocalDateTime completedAt;

    // Getters and setters
}
