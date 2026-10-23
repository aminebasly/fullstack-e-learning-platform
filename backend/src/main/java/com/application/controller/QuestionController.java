package com.application.controller;

import com.application.model.Question;
import com.application.model.QuizAttempt;
import com.application.model.User;
import com.application.repository.QuestionRepository;
import com.application.services.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController



public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizAttemptService quizAttemptService;

    // ✅ GET quiz questions by type (PLACEMENT, A1, A2...)
    @GetMapping("/quiz/{type}")
    public List<Question> getQuizByType(@PathVariable String type) {
        return questionRepository.findByQuizType(type.toUpperCase());
    }

    // ✅ POST user quiz attempt
    @PostMapping("/quiz-attempt")
    public Map<String, Object> submitQuizAttempt(@RequestBody Map<String, Object> data) {
        String email = (String) data.get("email");
        String quizType = (String) data.get("quizType");
        int score = (int) data.get("score");

        QuizAttempt attempt = quizAttemptService.saveAttempt(email, quizType, score);
        User user = attempt.getUser();

        return Map.of(
                "message", "Quiz submitted successfully",
                "score", score,
                "currentLevel", user.getCurrentLevel(),
                "accessType", user.getAccessType()
        );
    }


}
