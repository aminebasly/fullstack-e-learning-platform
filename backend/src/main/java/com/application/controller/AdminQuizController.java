package com.application.controller;



import com.application.model.Question;
import com.application.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quiz")


public class AdminQuizController {

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping("/create")
    public Question createQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    @PostMapping("/bulk")
    public List<Question> createQuestions(@RequestBody List<Question> questions) {
        for (Question q : questions) {
            if (q.getType().equals("MULTIPLE_CHOICE") && q.getCorrectOption() != null) {
                int correctedIndex = q.getCorrectOption() - 1;

                if (correctedIndex < 0 || correctedIndex > 3) {
                    throw new IllegalArgumentException("Correct option index must be between 1 and 4");
                }

                q.setCorrectOption(correctedIndex); // ✅ store as 0–3
            }
        }

        return questionRepository.saveAll(questions);
    }


    @GetMapping("/all")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}
