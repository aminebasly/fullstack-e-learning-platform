package com.application.services;

import com.application.model.Content;
import com.application.model.QuizAttempt;
import com.application.model.User;
import com.application.model.UserProgress;
import com.application.repository.ContentRepository;
import com.application.repository.QuizAttemptRepository;
import com.application.repository.UserProgressRepository;
import com.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserProgressService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Transactional
    public UserProgress markContentCompleted(String userEmail, Long contentId) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) throw new RuntimeException("User not found");

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        Optional<UserProgress> optionalProgress = userProgressRepository.findByUserAndContent(user, content);
        UserProgress progress = optionalProgress.orElse(new UserProgress());
        progress.setUser(user);
        progress.setContent(content);
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());

        return userProgressRepository.save(progress);
    }


    public List<UserProgress> getProgressByUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return List.of();
        }
        return userProgressRepository.findByUser(user);
    }

    public Map<String, Double> getProgressSummaryByLevel(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new HashMap<>();
        }

        List<UserProgress> progressList = userProgressRepository.findByUser(user);
        Map<String, Double> summary = new HashMap<>();
        String[] levels = {"A1", "A2", "B1", "B2", "C1", "C2"};

        for (String level : levels) {
            List<Content> levelContent = contentRepository.findByLevel(level);
            int totalContent = levelContent.size();
            System.out.println("Level: " + level + ", Total Content: " + totalContent); // Debug
            if (totalContent == 0) {
                summary.put(level, 0.0);
                continue;
            }
            long completedCount = progressList.stream()
                    .filter(p -> p.getContent().getLevel().equals(level) && p.isCompleted())
                    .count();
            double percentage = (completedCount * 100.0) / totalContent;
            summary.put(level, percentage);
        }
        return summary;
    }

    public long countCompletedContentsByUserEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return userProgressRepository.countByUserAndCompletedTrue(user);
    }

    public long getTotalCompletedContent() {
        return userProgressRepository.countCompletedContent();
    }


}
