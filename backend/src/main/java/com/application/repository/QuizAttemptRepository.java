package com.application.repository;

import com.application.model.Question;
import com.application.model.QuizAttempt;
import com.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt,Long> {
    // Find all quiz attempts by user and quiz type (level)
    List<QuizAttempt> findByUserAndQuizType(User user, String quizType);
    List<QuizAttempt> findByUser(User user);
    boolean existsByUserAndQuizType(User user, String quizType);
    List<QuizAttempt> findByUserAndQuizTypeOrderByAttemptedAtDesc(User user, String quizType);


}
