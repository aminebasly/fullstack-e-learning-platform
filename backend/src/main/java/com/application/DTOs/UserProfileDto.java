package com.application.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserProfileDto {
    private String username;
    private String mobile;
    private String gender;
    private String profession;
    private String address;
    private String password;
    private String role;
    private String currentLevel;
    private String badges;
    private String accessType;

    private String purchasedLevel; // e.g., "A1,B1,C1"



}