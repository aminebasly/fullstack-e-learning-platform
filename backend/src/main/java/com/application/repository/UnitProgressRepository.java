package com.application.repository;

import com.application.model.UnitProgress;
import com.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UnitProgressRepository extends JpaRepository<UnitProgress, Long> {
    List<UnitProgress> findByUserAndLevel(User user, String level);
    Optional<UnitProgress> findByUserAndLevelAndUnitNumber(User user, String level, int unitNumber);
}

