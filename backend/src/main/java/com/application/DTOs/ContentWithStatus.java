package com.application.DTOs;



import com.application.model.Content;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentWithStatus {
    private Long id;
    private String type;
    private String level;
    private Integer unitNumber;
    private Integer contentNumber;
    private String status; // COMPLETED, IN_PROGRESS, NOT_STARTED

    public ContentWithStatus(Content content, String status) {
        this.id = content.getId();
        this.type = content.getType();
        this.level = content.getLevel();
        this.unitNumber = content.getUnitNumber();
        this.contentNumber = content.getContentNumber();
        this.status = status;
    }
}

