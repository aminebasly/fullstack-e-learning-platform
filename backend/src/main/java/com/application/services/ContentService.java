package com.application.services;
import com.application.DTOs.ContentDetailDTO;
import com.application.DTOs.ContentSummaryDTO;
import com.application.DTOs.ContentWithStatus;
import com.application.DTOs.QuestionsDTO;
import com.application.model.Content;
import com.application.model.Question;

import com.application.model.User;
import com.application.model.UserProgress;
import com.application.repository.ContentRepository;
import com.application.repository.QuestionRepository;
import com.application.repository.UserProgressRepository;
import com.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service

public class ContentService {

    @Autowired
    private ContentRepository contentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private QuestionRepository questionRepository;



    public Content saveContent(Content content) {
        return contentRepository.save(content);
    }

    public boolean existsByLevelUnitTypeAndContentNumber(String level, int unitNumber, int contentNumber,String type) {
        return contentRepository.existsByLevelAndUnitNumberAndTypeAndContentNumber(level, unitNumber,type, contentNumber);
    }



    public List<Content> getContentsByLevelAndUnit(String level, int unitNumber) {
        return contentRepository.findByLevelAndUnitNumber(level, unitNumber);
    }




    public List<ContentWithStatus> getContentWithStatus(String email, String level, int unitNumber) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Content> contents = contentRepository.findByLevelAndUnitNumber(level, unitNumber);
        List<UserProgress> progressList = userProgressRepository.findByUser(user);

        Map<Long, UserProgress> progressMap = new HashMap<>();
        for (UserProgress p : progressList) {
            if (p.getContent() != null) {
                progressMap.put(p.getContent().getId(), p);
            }
        }

        List<ContentWithStatus> result = new ArrayList<>();
        for (Content content : contents) {
            UserProgress p = progressMap.get(content.getId());
            String status = "NOT_STARTED";
            if (p != null) {
                status = p.isCompleted() ? "COMPLETED" : "IN_PROGRESS";
            }
            result.add(new ContentWithStatus(content, status));
        }

        return result;
    }




    public Page<ContentSummaryDTO> getContentList(String level, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Content> contentPage = (level != null && !level.isEmpty())
                ? contentRepository.findByLevel(level, pageable)
                : contentRepository.findAll(pageable);

        return contentPage.map(content -> {
            ContentSummaryDTO dto = new ContentSummaryDTO();
            dto.setId(content.getId());
            dto.setLevel(content.getLevel());
            dto.setUnitNumber(content.getUnitNumber());
            dto.setContentNumber(content.getContentNumber());
            dto.setType(content.getType());
            dto.setUrl(content.getUrl());
            return dto;
        });
    }


    public ContentDetailDTO getContentDetail(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id " + id));

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
        return dto;
    }





    @Transactional
    public void deleteContent(Long id) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));

        userRepository.clearLastContentVisited(content);
        userProgressRepository.deleteByContent(content);
        content.getQuestions().forEach(question -> question.getOptions().clear());
        questionRepository.deleteByContent(content);

        // Delete the Content entity
        contentRepository.delete(content);
    }

    public Content getContentByLevelUnitAndNumber(String level, int unitNumber, int contentNumber) {
        return contentRepository.findByLevelAndUnitNumberAndContentNumber(level, unitNumber, contentNumber)
                .orElseThrow(() -> new RuntimeException(
                        "Content not found for level: " + level + ", unit: " + unitNumber + ", content number: " + contentNumber));
    }


}
