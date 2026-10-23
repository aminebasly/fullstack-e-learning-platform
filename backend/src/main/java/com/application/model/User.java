package com.application.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {
	@Id
	@Column(nullable = false, unique = true)
	private String email;
	private String username;
	private String userid;
	private String mobile;
	private String gender;
	private String profession;
	private String address;
	private String password;
	private String role;
	private String accessType; // New
	private String purchasedLevel; // New
	private String currentLevel;
	private String badges ; // Updated
	private LocalDateTime createdAt;
	private int completedUnits = 0;

	@Transient
	private String confirmPassword; // Updated
	private String resetPasswordToken;
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<QuizAttempt> quizAttempts = new ArrayList<>(); // New
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<UserProgress> contentProgress = new ArrayList<>(); // New
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Payment> payments = new ArrayList<>(); // New
	@ManyToOne
	private Content lastContentVisited;
	@Column(nullable = false)
	private boolean paymentRequired = true;

	@Column(nullable = false)
	private boolean quizCompleted = false;




	// Custom constructor (optional)
	public User(String email, String username, String userid, String mobile, String gender,
				String profession, String address, String password,String badges, String role) {
		this.email = email;
		this.username = username;
		this.userid = userid;
		this.mobile = mobile;
		this.gender = gender;
		this.profession = profession;
		this.address = address;
		this.password = password;
		this.role = role;
		this.accessType = "None";

		this.badges = badges;
		this.quizAttempts = new ArrayList<>();
		this.contentProgress = new ArrayList<>();
		this.payments = new ArrayList<>();
	}

	public Set<String> getPurchasedLevelsAsSet() {
		if (this.purchasedLevel == null || this.purchasedLevel.trim().isEmpty()) return new HashSet<>();
		return Arrays.stream(this.purchasedLevel.split(","))
				.map(String::trim)
				.collect(Collectors.toSet());
	}

	public void addPurchasedLevel(String level) {
		Set<String> levels = getPurchasedLevelsAsSet();
		levels.add(level);
		this.purchasedLevel = String.join(",", levels);
	}

	public boolean hasPurchasedLevel(String level) {
		return getPurchasedLevelsAsSet().contains(level);
	}







}