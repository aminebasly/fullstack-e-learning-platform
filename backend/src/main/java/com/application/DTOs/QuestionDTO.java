package com.application.DTOs;

import java.util.List;

public class QuestionDTO {
    private String text;
    private String type;
    private List<String> options;
    private Integer correctOption;

    // Getters and setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public Integer getCorrectOption() { return correctOption; }
    public void setCorrectOption(Integer correctOption) { this.correctOption = correctOption; }
}
