package com.application.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class UnitProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int unitNumber;
    private int completedContentCount;
    private String level;

    @ManyToOne
    private User user;

    public UnitProgress(int unitNumber, int completedContentCount, String level) {
        this.unitNumber = unitNumber;
        this.completedContentCount = completedContentCount;
        this.level = level;
    }
}





