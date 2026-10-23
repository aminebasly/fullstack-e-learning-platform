package com.application.repository;

import com.application.model.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface ContentRepository extends JpaRepository<Content,Long> {
    List<Content> findByLevel(String level);
    Optional<Content> findById(Long id);
    List<Content> findByLevelAndUnitNumber(String level, int unitNumber);
    boolean existsByLevelAndUnitNumberAndTypeAndContentNumber(String level, int unitNumber,String type, int contentNumber);
    @Query("SELECT c FROM Content c LEFT JOIN FETCH c.questions WHERE c.level = :level")
    List<Content> findByLevelWithQuestions(@Param("level") String level);

    Page<Content> findByLevel(String level, Pageable pageable);
    Optional<Content> findByLevelAndUnitNumberAndContentNumber(String level, int unitNumber, int contentNumber);
}
