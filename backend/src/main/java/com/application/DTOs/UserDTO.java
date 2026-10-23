package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    private String email;
    private String username;
    private String currentLevel;

    private String badges;
    private String accessType;
    private String purchasedLevel;
    private List<UserProgressDTO> contentProgress;
    private List<QuizAttemptDTO> quizAttempts;
}
