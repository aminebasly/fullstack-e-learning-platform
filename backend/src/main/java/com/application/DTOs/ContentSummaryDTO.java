package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ContentSummaryDTO {
    private Long id;
    private String level;
    private int unitNumber;
    private int contentNumber;
    private String type;
    private String url;
}
