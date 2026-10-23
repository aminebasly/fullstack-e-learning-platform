package com.application.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;

import com.application.DTOs.QuizResultDTO;

import com.application.DTOs.UserProfileDto;
import com.application.model.*;
import com.application.repository.UserRepository;

import com.application.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")


public class UserController 
{
	@Autowired
	private UserService userService;
	

	@Autowired
	private UserRepository userRepo;
	@Autowired
	private UserProgressService userProgressService;
	@Autowired
	private QuizAttemptService quizAttemptService;
	
	@GetMapping("/userlist")
	

	public ResponseEntity<List<User>> getUsers() throws Exception
	{
		List<User> users = userService.getAllUsers();
		return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
	





	@PutMapping("/profile/{email}")
	public ResponseEntity<User> updateUserProfile(
			@PathVariable String email,
			@RequestBody UserProfileDto updatedUser) {
		try {
			User updated = userService.updateUserProfile(email, updatedUser);
			return ResponseEntity.ok(updated);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	@GetMapping("/gettotalusers")
	

	public ResponseEntity<List<Integer>> getTotalUsers() throws Exception
	{
		List<User> users = userService.getAllUsers();
		List<Integer> usersCount = new ArrayList<>();
		usersCount.add(users.size());
		return new ResponseEntity<List<Integer>>(usersCount, HttpStatus.OK);
	}
	

	


	

	@PostMapping("/update-level")
	public ResponseEntity<?> updateUserLevel(@RequestBody Map<String, String> request) {
		if (!request.containsKey("email") || !request.containsKey("level")) {
			return ResponseEntity.badRequest().body("Missing email or level");
		}

		String email = request.get("email");
		String level = request.get("level");

		User user = userRepo.findByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		user.setCurrentLevel(level);

		try {
			userRepo.save(user);
			return ResponseEntity.ok("Level updated successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to update level: " + e.getMessage());
		}
	}

	

	@GetMapping("/profile/{email}")
	public ResponseEntity<User> getUserProfile(@PathVariable String email) {
		User user = userRepo.findByEmail(email);
		return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
	}

	@GetMapping("/userprofileDetails/{email}")
	

	public ResponseEntity<List<User>> getProfileDetails(@PathVariable String email) throws Exception {
		List<User> users = userService.fetchProfileByEmail(email);
		return new ResponseEntity<List<User>>(users, HttpStatus.OK); }

    

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<String> deleteUserByEmail(@PathVariable String email) {
        userService.deleteUserByEmail(email);
        return new ResponseEntity<>("User with email '" + email + "' deletion initiated.", HttpStatus.OK);
    }

	

	@GetMapping("/search")
	public List<User> searchUsers(@RequestParam("query") String query) {
		return userRepo.searchUsers(query);
	}

	

	@PostMapping("/quiz-result")
	public ResponseEntity<String> storeQuizResult(@RequestBody QuizResultDTO dto) {
		try {
			userService.updateQuizResult(dto);
			return ResponseEntity.ok("Quiz result saved successfully.");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error saving quiz result: " + e.getMessage());
		}
	}




	

	@GetMapping("/progress/{email}")
	public ResponseEntity<List<UserProgress>> getUserProgress(@PathVariable String email) {
		List<UserProgress> progress = userProgressService.getProgressByUser(email);
		return ResponseEntity.ok(progress);
	}
	

	@GetMapping("/quiz-attempts/{email}")
	public ResponseEntity<List<QuizAttempt>> getQuizAttempts(@PathVariable String email) {
		List<QuizAttempt> attempts = quizAttemptService.getAttemptsByUser(email);
		return ResponseEntity.ok(attempts);
	}
	

	@GetMapping("/access/{email}")
	public ResponseEntity<Map<String, Boolean>> getLevelAccess(@PathVariable String email) {
		Map<String, Boolean> access = userService.getLevelAccess(email);
		return ResponseEntity.ok(access);
	}

	

	@GetMapping("/last-content")
	public ResponseEntity<Content> getLastContentVisited(@RequestParam String email) {
		return userService.getLastContentVisited(email)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.noContent().build());
	}
	

	@PostMapping("/last-content")
	public ResponseEntity<Void> updateLastContentVisited(@RequestParam String email, @RequestParam Long contentId) {
		try {
			userService.updateLastContentVisited(email, contentId);
			return ResponseEntity.ok().build();
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping("/users-access-gender")
	public Map<String, Map<String, Long>> getUsersAccessByGender() {
		return userService.getAccessByGender();
	}








}
