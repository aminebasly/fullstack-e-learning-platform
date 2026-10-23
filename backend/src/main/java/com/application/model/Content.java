package com.application.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

@Table(name = "content", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"level", "unitNumber", "contentNumber"})
})
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "VIDEO", "LISTENING", "GRAMMAR"
    private String url; // Media URL or text for grammar
    private String level; // e.g., "A1"
    private Integer unitNumber; // 1, 2, or 3
    private Integer contentNumber; // 1, 2, or 3 within unit

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();


    @Column(columnDefinition = "TEXT")
    private String grammarHtml; // For GRAMMAR type only
    private String pdfUrl;


    public Content(String type, String url, String level, Integer unitNumber, Integer contentNumber,String grammarHtml) {
        this.type = type;
        this.url = url;
        this.level = level;
        this.unitNumber = unitNumber;
        this.contentNumber = contentNumber;
        this.questions = new ArrayList<>();
        this.grammarHtml=grammarHtml;

    }
}