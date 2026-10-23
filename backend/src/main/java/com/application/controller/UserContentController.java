package com.application.controller;

import com.application.model.CompleteContentResponse;
import com.application.model.Content;
import com.application.model.UserProgress;
import com.application.services.ContentService;
import com.application.services.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/content")



public class UserContentController {

    @Autowired
    private ContentService contentService;

    @Autowired
    private UserProgressService userProgressService;




    

    @PostMapping("/complete/{contentId}")
    public ResponseEntity<CompleteContentResponse> completeContent(
            @PathVariable Long contentId,
            @RequestParam String email) {

        // Use the simplified method without score or promotion
        UserProgress progress = userProgressService.markContentCompleted(email, contentId);

        // No prompt needed if there's no promotion logic anymore, but can be kept if you want to notify user
        return ResponseEntity.ok(new CompleteContentResponse(progress, null));
    }



    

    @GetMapping("/progress-summary/{email}")
    public ResponseEntity<Map<String, Double>> getProgressSummary(@PathVariable String email) {
        Map<String, Double> progressSummary = userProgressService.getProgressSummaryByLevel(email);
        return ResponseEntity.ok(progressSummary);
    }



    @GetMapping("/by-unit")
    public ResponseEntity<List<Content>> getContentByUnit(
            @RequestParam String level,
            @RequestParam int unitNumber
    ) {
        List<Content> contents = contentService.getContentsByLevelAndUnit(level, unitNumber);
        return ResponseEntity.ok(contents);
    }

    @GetMapping("/completed-count")
    public ResponseEntity<Long> getCompletedContentCount(@RequestParam String email) {
        long count = userProgressService.countCompletedContentsByUserEmail(email);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/total-completed-content")
    public long getTotalCompletedContent() {
        return userProgressService.getTotalCompletedContent();
    }



}