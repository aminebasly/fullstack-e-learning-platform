package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter

public class QuestionsDTO {
    private Long id;
    private String text;
    private String type;
    private List<String> options;
    private int correctOption;
}
