package com.application.controller;

import com.application.DTOs.ContentDTO;
import com.application.DTOs.ContentWithStatus;
import com.application.DTOs.QuestionDTO;
import com.application.model.Content;
import com.application.model.Question;
import com.application.repository.ContentRepository;
import com.application.services.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")


public class ContentController {

    @Autowired
    private ContentService contentService;
    @Autowired
    private ContentRepository contentRepository;

    @PostMapping("/create")
    

    public ResponseEntity<?> createContent(@RequestBody ContentDTO contentDTO) {
        // Check if content with same Level, Unit, and Content Number exists
        boolean exists = contentService.existsByLevelUnitTypeAndContentNumber(
                contentDTO.getLevel(),
                contentDTO.getUnitNumber(),
                contentDTO.getContentNumber(),
                contentDTO.getType()
        );

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("⚠️ A content already exists for Level: " + contentDTO.getLevel()
                            + ", Unit: " + contentDTO.getUnitNumber()
                            + ", Content: " + contentDTO.getContentNumber());
        }

        // Proceed to create content
        Content content = new Content();
        content.setType(contentDTO.getType());
        content.setUrl(contentDTO.getUrl());
        content.setLevel(contentDTO.getLevel());
        content.setUnitNumber(contentDTO.getUnitNumber());
        content.setContentNumber(contentDTO.getContentNumber());
        content.setGrammarHtml(contentDTO.getGrammarHtml());
        content.setPdfUrl(contentDTO.getPdfUrl());

        for (QuestionDTO questionDTO : contentDTO.getQuestions()) {
            Question question = new Question(
                    questionDTO.getText(),
                    questionDTO.getType(),
                    questionDTO.getOptions(),
                    questionDTO.getCorrectOption()
            );
            question.setContent(content);
            content.getQuestions().add(question);
        }

        Content savedContent = contentService.saveContent(content);
        return ResponseEntity.ok(savedContent);
    }


    @GetMapping("/status")
    

    public ResponseEntity<List<ContentWithStatus>> getContentWithStatus(
            @RequestParam String email,
            @RequestParam String level,
            @RequestParam int unitNumber) {
        List<ContentWithStatus> contentStatusList = contentService.getContentWithStatus(email, level, unitNumber);
        return ResponseEntity.ok(contentStatusList);
    }

    

    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(@PathVariable Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found"));
        return ResponseEntity.ok(content);
    }
    

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkIfContentExists(
            @RequestParam String level,
            @RequestParam String type,
            @RequestParam int unitNumber,
            @RequestParam int contentNumber) {
        try {
            boolean exists = contentService.existsByLevelUnitTypeAndContentNumber(level, unitNumber , contentNumber,type);
            return ResponseEntity.ok(exists);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(false);
        }
    }


}



