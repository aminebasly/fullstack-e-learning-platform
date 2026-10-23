package com.application.repository;

import com.application.model.User;
import com.application.model.UserProgress;
import com.application.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    // Find all completed progress entries for a user at a certain level


    List<UserProgress> findByUser(User user);
    Optional<UserProgress> findByUserAndContent(User user, Content content);
    List<UserProgress> findByUserAndCompletedTrue(User user);
    long countByUserAndCompletedTrue(User user);
    void deleteByContent(Content content);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.completed = true")
    long countCompletedContent();
}
