package com.application.services;

import java.util.*;
import java.util.stream.Collectors;

import com.application.DTOs.QuizResultDTO;
import com.application.DTOs.UserProfileDto;
import com.application.model.Professor;
import com.application.repository.ContentRepository;
import com.application.repository.ProfessorRepository;
import com.application.model.Content;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.application.model.User;
import com.application.repository.UserRepository;

import javax.transaction.Transactional;

@Service
public class UserService 
{
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private ContentRepository contentRepository;
	@Autowired
	private ProfessorRepository professorRepository;
	public User saveUser(User user)
	{
		return userRepo.save(user);
	}

	@Transactional
	public User updateUserProfile(String email, UserProfileDto updatedUser) {
		// Find existing user by email
		User existingUser = userRepo.findByEmail(email);
		if (existingUser == null) {
			throw new RuntimeException("User not found with email: " + email); // Consider a custom exception
		}

		// Update fields if provided in DTO
		if (updatedUser.getUsername() != null) existingUser.setUsername(updatedUser.getUsername());
		if (updatedUser.getMobile() != null) existingUser.setMobile(updatedUser.getMobile());
		if (updatedUser.getGender() != null) existingUser.setGender(updatedUser.getGender());
		if (updatedUser.getProfession() != null) existingUser.setProfession(updatedUser.getProfession());
		if (updatedUser.getAddress() != null) existingUser.setAddress(updatedUser.getAddress());
		if (updatedUser.getRole() != null) existingUser.setRole(updatedUser.getRole());
		if (updatedUser.getCurrentLevel() != null) existingUser.setCurrentLevel(updatedUser.getCurrentLevel());
		if (updatedUser.getBadges() != null) existingUser.setBadges(updatedUser.getBadges());

		// Handle password securely
		if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
			existingUser.setPassword(updatedUser.getPassword());
		}
		if (updatedUser.getPurchasedLevel() != null) {
			existingUser.setPurchasedLevel(updatedUser.getPurchasedLevel());
		}


		// Update payment status (fixed from missing implementation)
		if (updatedUser.getAccessType() != null) {
			existingUser.setAccessType(updatedUser.getAccessType());
		}

		return userRepo.save(existingUser);
	}
	
	public List<User> getAllUsers()
	{
		return (List<User>)userRepo.findAll();
	}
	
	public User fetchUserByEmail(String email)
	{
		return userRepo.findByEmail(email);
	}
	
	public User fetchUserByUsername(String username)
	{
		return userRepo.findByUsername(username);
	}

	public User fetchUserByEmailAndPassword(String email, String password) {
		User user = userRepo.findByEmail(email);
		if (user != null && password.equals(user.getPassword())) {
			return user;
		}
		return null;
	}

	public List<User> fetchProfileByEmail(String email)
	{
		return (List<User>)userRepo.findProfileByEmail(email);
	}



	public void updateResetPasswordToken(String token, String email) throws Exception {
		User user = userRepo.findByEmail(email);
		if (user != null) {
			user.setResetPasswordToken(token);
			userRepo.save(user);
		} else {
			throw new Exception("Could not find any user with the email " + email);
		}
	}

	public User getByResetPasswordToken(String token) {
		return userRepo.findByResetPasswordToken(token);
	}

	public void updatePassword(User user, String newPassword) {
		user.setPassword(newPassword); // Store password as plain text
		user.setResetPasswordToken(null);
		userRepo.save(user);
	}


	@Transactional
	public void deleteUserByEmail(String email) {

		userRepo.deleteByEmail(email);
	}

	public String getAccessType(String email) {
		User user = userRepo.findByEmail(email);
		return user != null ? user.getAccessType() : null;
	}

	public String getCurrentLevel(String email) {
		User user = userRepo.findByEmail(email);
		return user != null ? user.getCurrentLevel() : null;
	}
	public String getUsername(String email) {
		User user = userRepo.findByEmail(email);
		return user != null ? user.getUsername() : null;
	}
	public String getGender(String email) {
		Professor professor = professorRepository.findByEmail(email);
		if (professor != null) {
			System.out.println("Gender for " + email + ": " + professor.getGender()); // ← AJOUT ICI
			return professor.getGender();
		}
		System.out.println("Professor not found for email: " + email); // ← AJOUT ICI
		return null;
	}



	public void updateQuizResult(QuizResultDTO dto) {
		User user = userRepo.findByEmail(dto.getEmail());
				if (user == null) {
			throw new RuntimeException("User not found with email: " + dto.getEmail()); // Consider a custom exception
		}


		user.setCurrentLevel(dto.getLevel());

		if ("Single".equalsIgnoreCase(dto.getAccessType())) {
			user.setPurchasedLevel(dto.getLevel());
		}

		userRepo.save(user);
	}

	public Map<String, Boolean> getLevelAccess(String email) {
		User user = userRepo.findByEmail(email);
		if (user == null) {
			return new HashMap<>();
		}

		Map<String, Boolean> access = new HashMap<>();
		String[] levels = {"A1", "A2", "B1", "B2", "C1", "C2"};
		Set<String> purchased = user.getPurchasedLevelsAsSet(); // use helper method

		for (String level : levels) {
			boolean hasAccess = "Full".equalsIgnoreCase(user.getAccessType()) || purchased.contains(level);
			access.put(level, hasAccess);
		}

		return access;
	}

	public Optional<Content> getLastContentVisited(String email) {
		return Optional.ofNullable(userRepo.findLastContentVisitedByEmail(email));
	}

	@Transactional
	public void updateLastContentVisited(String email, Long contentId) {
		User user = userRepo.findByEmail(email);
		if (user == null) {
			throw new IllegalArgumentException("User not found for email: " + email);
		}
		Content content = contentRepository.findById(contentId)
				.orElseThrow(() -> new IllegalArgumentException("Content not found for ID: " + contentId));
		user.setLastContentVisited(content);
		userRepo.save(user);
	}

	public Map<String, Map<String, Long>> getAccessByGender() {
		Map<String, Map<String, Long>> result = new HashMap<>();

		Map<String, Long> fullAccess = new HashMap<>();
		fullAccess.put("male", userRepo.countFullAccessByGender("male"));
		fullAccess.put("female", userRepo.countFullAccessByGender("female"));

		Map<String, Long> singleAccess = new HashMap<>();
		singleAccess.put("male", userRepo.countSingleAccessByGender("male"));
		singleAccess.put("female", userRepo.countSingleAccessByGender("female"));

		result.put("fullAccess", fullAccess);
		result.put("singleAccess", singleAccess);

		return result;
	}



}