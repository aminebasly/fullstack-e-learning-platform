package com.application.model;
import com.application.model.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String quizType; // "PLACEMENT" or level (e.g., "A1")
    private Integer score; // Percentage (0-100)
    private LocalDateTime attemptedAt;

    // Getters and setters
}