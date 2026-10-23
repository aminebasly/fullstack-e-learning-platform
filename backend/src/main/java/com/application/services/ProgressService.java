package com.application.services;

// src/main/java/com/application/service/ProgressService.java


import com.application.DTOs.UnitProgress;
import com.application.model.Content;
import com.application.model.User;
import com.application.model.UserProgress;
import com.application.repository.ContentRepository;
import com.application.repository.UserProgressRepository;
import com.application.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProgressService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    public List<UnitProgress> getUnitProgressForUser(String email, String level) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        // Use the level passed from frontend
        List<Content> levelContent = contentRepository.findByLevel(level);

        Map<Integer, List<Content>> contentByUnit = levelContent.stream()
                .collect(Collectors.groupingBy(Content::getUnitNumber));

        Set<Long> completedContentIds = userProgressRepository.findByUserAndCompletedTrue(user).stream()
                .map(progress -> progress.getContent().getId())
                .collect(Collectors.toSet());

        List<UnitProgress> result = new ArrayList<>();
        for (Map.Entry<Integer, List<Content>> entry : contentByUnit.entrySet()) {
            int unitNumber = entry.getKey();
            List<Content> unitContents = entry.getValue();
            int total = unitContents.size();
            int completed = (int) unitContents.stream()
                    .filter(content -> completedContentIds.contains(content.getId()))
                    .count();

            result.add(new UnitProgress(unitNumber, completed, total));
        }

        result.sort(Comparator.comparingInt(UnitProgress::getUnitNumber));
        return result;
    }




}

