package com.application.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dm7qvbgav",
                "api_key", "868825893192588",
                "api_secret", "FlQqfoUgYE17xzCbGAEMOGAK28k"));
    }
}
