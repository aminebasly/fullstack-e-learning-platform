package com.application.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {

    private final Cloudinary cloudinary;

    public CloudinaryController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteOriginal(@RequestParam String publicId) {
        Map<String, String> response = new HashMap<>();
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            response.put("message", "Deleted original: " + result.get("result"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Error deleting file: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}

