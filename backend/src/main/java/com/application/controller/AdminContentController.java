package com.application.controller;

import com.application.DTOs.ContentDetailDTO;
import com.application.DTOs.ContentSummaryDTO;
import com.application.DTOs.QuestionsDTO;
import com.application.model.Content;
import com.application.model.Question;
import com.application.repository.ContentRepository;
import com.application.services.ContentService;
import com.application.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/admin") // ✅ Admin prefix to avoid conflicts
public class AdminContentController {
    @Autowired
    private ContentRepository contentRepository;

    @Autowired
    private ContentService contentService;

    @Autowired
    private QuestionService quizService;

    @GetMapping("/content")
    public ResponseEntity<Page<ContentSummaryDTO>> getContentList(
            @RequestParam(required = false) String level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(contentService.getContentList(level, page, size));
    }

    // Get full content detail by ID (including questions)
    @GetMapping("/content/{id}")
    public ResponseEntity<ContentDetailDTO> getContentDetail(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentDetail(id));
    }

    // Update content with new data


    // Delete content by ID (with cascade handled in service)
    @DeleteMapping("/content/{id}")
    public ResponseEntity<String> deleteContent(@PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok("✅ Content deleted successfully.");
    }


    @GetMapping("/content/search")
    public ResponseEntity<ContentDetailDTO> getContentByLevelUnitAndNumber(
            @RequestParam String level,
            @RequestParam int unitNumber,
            @RequestParam int contentNumber) {

        Content content = contentService.getContentByLevelUnitAndNumber(level, unitNumber, contentNumber);

        // Map Content to ContentDetailDTO (assuming similar as in your existing code)
        ContentDetailDTO dto = new ContentDetailDTO();
        dto.setId(content.getId());
        dto.setLevel(content.getLevel());
        dto.setUnitNumber(content.getUnitNumber());
        dto.setContentNumber(content.getContentNumber());
        dto.setType(content.getType());
        dto.setUrl(content.getUrl());
        dto.setGrammarHtml(content.getGrammarHtml());
        dto.setPdfUrl(content.getPdfUrl());

        List<QuestionsDTO> questions = content.getQuestions().stream().map(q -> {
            QuestionsDTO qDto = new QuestionsDTO();
            qDto.setId(q.getId());
            qDto.setText(q.getText());
            qDto.setType(q.getType());
            qDto.setOptions(q.getOptions());
            qDto.setCorrectOption(q.getCorrectOption());
            return qDto;
        }).collect(Collectors.toList());

        dto.setQuestions(questions);

        return ResponseEntity.ok(dto);
    }
    // ----------------- QUIZ ----------------- //

    @GetMapping("/quiz")
    public List<Question> getAllQuizQuestionsByLevel(@RequestParam String level) {
        return quizService.getAllQuizQuestionsByQuizType(level);
    }



    @DeleteMapping("/quiz")
    public ResponseEntity<Void> deleteQuizQuestionsByType(@RequestParam String level) {
        quizService.deleteAllByQuizType(level);
        return ResponseEntity.noContent().build();
    }


}

