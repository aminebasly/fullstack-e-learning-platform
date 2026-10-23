package com.application.controller;



import com.application.DTOs.UnitProgress;
import com.application.services.ProgressService;
import com.application.model.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/unit")
    public ResponseEntity<List<UnitProgress>> getUnitProgress(
            @RequestParam String email,
            @RequestParam String level) {
        List<UnitProgress> progress = progressService.getUnitProgressForUser(email, level);
        return ResponseEntity.ok(progress);
    }





}

