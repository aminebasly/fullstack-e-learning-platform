package com.application.services;

import com.application.model.QuizAttempt;
import com.application.model.User;
import com.application.repository.QuizAttemptRepository;
import com.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    public List<QuizAttempt> getAttemptsByUser(String email) {
        User user = userRepository.findByEmail(email);
        return (user == null) ? List.of() : quizAttemptRepository.findByUser(user);
    }

    public QuizAttempt saveAttempt(String email, String quizType, int score) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        List<QuizAttempt> pastAttempts = quizAttemptRepository.findByUserAndQuizTypeOrderByAttemptedAtDesc(user, quizType.toUpperCase());

        boolean hasPassed = pastAttempts.stream().anyMatch(a -> a.getScore() >= 70);
        if (hasPassed) {
            throw new IllegalStateException("You have already passed this quiz and cannot attempt it again.");
        }


        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuizType(quizType.toUpperCase());
        attempt.setScore(score);
        attempt.setAttemptedAt(LocalDateTime.now());

        if ("PLACEMENT".equalsIgnoreCase(quizType)) {
            String level = determineLevelFromScore(score);
            user.setCurrentLevel(level);
            user.setPurchasedLevel(level);
            addBadgeToUser(user, level);
        } else {
            if ("Full".equalsIgnoreCase(user.getAccessType())&& score >= 70) {
                String nextLevel = getNextLevel(user.getCurrentLevel());
                if (nextLevel != null) {
                    user.setQuizCompleted(true);
                    user.setCurrentLevel(nextLevel);
                    addBadgeToUser(user, nextLevel);
                }
            } else if ("Single".equalsIgnoreCase(user.getAccessType()) && score >= 70) {
                String nextLevel = getNextLevel(user.getCurrentLevel());
                if (nextLevel != null) {
                     // FLAG IMPORTANT
                    user.setQuizCompleted(true);
                    addBadgeToUser(user, nextLevel);
                }
            }
        }

        // Special badge upgrade if user passes C2 quiz again
        if ("C2".equalsIgnoreCase(quizType) && score >= 70) {
            upgradeBadgeAfterMaster(user);
        }

        userRepository.save(user);
        return quizAttemptRepository.save(attempt);
    }

    private String determineLevelFromScore(int score) {
        if (score >= 90) return "C2";
        if (score >= 80) return "C1";
        if (score >= 70) return "B2";
        if (score >= 60) return "B1";
        if (score >= 50) return "A2";
        return "A1";
    }

    private String getBadgeForLevel(String level) {
        if (level == null) return "none";
        switch (level.toUpperCase()) {
            case "A1": return "Bronze";
            case "A2": return "Silver";
            case "B1": return "Gold";
            case "B2": return "Platinum";
            case "C1": return "Diamond";
            case "C2": return "Master";
            default: return "none";
        }
    }

    private String getNextLevel(String currentLevel) {
        List<String> levels = List.of("A1", "A2", "B1", "B2", "C1", "C2");
        int index = levels.indexOf(currentLevel.toUpperCase());
        if (index >= 0 && index < levels.size() - 1) {
            return levels.get(index + 1);
        }
        return null;
    }

    private void addBadgeToUser(User user, String level) {
        String currentBadges = user.getBadges();
        String newBadge = getBadgeForLevel(level);

        if (newBadge.equals("none")) return;

        if (currentBadges == null || currentBadges.isEmpty()) {
            user.setBadges(newBadge);
        } else {
            List<String> badgeList = new ArrayList<>(List.of(currentBadges.split(",")));
            boolean hasBadge = badgeList.stream()
                    .map(String::trim)
                    .anyMatch(b -> b.equalsIgnoreCase(newBadge));
            if (!hasBadge) {
                badgeList.add(newBadge);
                user.setBadges(String.join(",", badgeList));
            }
        }
    }

    private void upgradeBadgeAfterMaster(User user) {
        String currentBadges = user.getBadges();
        if (currentBadges == null || currentBadges.isEmpty()) {
            // No badges yet, assign Master as fallback
            user.setBadges("Master");
            return;
        }
        List<String> badgeList = new ArrayList<>(List.of(currentBadges.split(",")));
        boolean hasMaster = badgeList.stream()
                .map(String::trim)
                .anyMatch(b -> b.equalsIgnoreCase("Master"));
        boolean hasLegend = badgeList.stream()
                .map(String::trim)
                .anyMatch(b -> b.equalsIgnoreCase("Legend"));

        if (hasMaster && !hasLegend) {
            // Add new higher badge "Legend" after Master
            badgeList.add("Legend");
            user.setBadges(String.join(",", badgeList));
        }
        // else: user already has Legend or no Master, no change
    }
}
