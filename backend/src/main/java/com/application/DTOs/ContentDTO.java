package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Setter
@Getter

public class ContentDTO {
    private String type;
    private String url;
    private String level;
    private Integer unitNumber;
    private Integer contentNumber;
    private List<QuestionDTO> questions;
    private String grammarHtml;
    private String pdfUrl;



    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public Integer getUnitNumber() { return unitNumber; }
    public void setUnitNumber(Integer unitNumber) { this.unitNumber = unitNumber; }
    public Integer getContentNumber() { return contentNumber; }
    public void setContentNumber(Integer contentNumber) { this.contentNumber = contentNumber; }
    public List<QuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDTO> questions) { this.questions = questions; }
}
