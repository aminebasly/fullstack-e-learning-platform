package com.application.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text; // e.g., "What is the main idea of the video?"
    private String type; // e.g., "MULTIPLE_CHOICE", "TRUE_FALSE"

    @ElementCollection(fetch = FetchType.LAZY)
    private List<String> options = new ArrayList<>(); // e.g., ["Option A", "Option B"]

    private Integer correctOption;
    private String quizType;// Index of correct option (e.g., 1 for "Option A")

    @ManyToOne
    @JoinColumn(name = "content_id")
    @JsonBackReference
    private Content content;





    public Question(String text, String type, List<String> options, Integer correctOption) {
        this.text = text;
        this.type = type;
        this.options = options != null ? new ArrayList<>(options) : new ArrayList<>();
        this.correctOption = correctOption;
    }
}