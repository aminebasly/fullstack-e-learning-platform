package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter

public class ContentDetailDTO {
    private Long id;
    private String level;
    private int unitNumber;
    private int contentNumber;
    private String type;
    private String url;
    private String grammarHtml;
    private String pdfUrl;
    private List<QuestionsDTO> questions;
}
