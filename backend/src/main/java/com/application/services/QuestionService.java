package com.application.services;

import com.application.model.Question;
import com.application.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository quizRepository;

    public List<Question> getAllQuizQuestionsByQuizType(String quizType) {
        return quizRepository.findByQuizType(quizType);
    }



    public void deleteAllByQuizType(String quizType) {
        List<Question> questions = quizRepository.findByQuizType(quizType);
        quizRepository.deleteAll(questions);
    }

}
