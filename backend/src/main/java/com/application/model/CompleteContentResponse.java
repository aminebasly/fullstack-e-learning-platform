package com.application.model;


import com.application.model.UserProgress;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteContentResponse {
    private UserProgress progress;
    private String prompt;

    public CompleteContentResponse(UserProgress progress, String prompt) {
        this.progress = progress;
        this.prompt = prompt;
    }
}
