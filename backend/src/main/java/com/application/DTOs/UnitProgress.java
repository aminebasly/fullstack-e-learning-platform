// src/main/java/com/application/dto/UnitProgress.java
package com.application.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnitProgress {
    private int unitNumber;
    private int completedContentCount;
    private int totalContentCount;
}
