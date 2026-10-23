package com.application.controller;

import com.application.Util.JwtUtil;
import com.application.services.EmailService;
import org.springframework.beans.factory.annotation.Value; // ✅ Correct

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.application.model.Professor;
import com.application.model.User;
import com.application.services.ProfessorService;
import com.application.services.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController

public class LoginController
{
	@Autowired
	private UserService userService;

	@Autowired
	private ProfessorService professorService;
	@Autowired
	private EmailService emailService;

	@Autowired
	private JwtUtil jwtUtil;

	@Value("${admin.email}")
	private String adminEmail;

	@Value("${admin.password}")
	private String adminHashedPassword;



	@PostMapping("/loginuser")
	

	public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response) throws Exception {
		String currEmail = user.getEmail();
		String currPassword = user.getPassword();

		User userObj = userService.fetchUserByEmailAndPassword(currEmail, currPassword);
		if (userObj == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}

		String token = jwtUtil.generateToken(userObj.getEmail(), "USER");

		ResponseCookie cookie = ResponseCookie.from("jwt", token)
				.httpOnly(true)
				.secure(true) // ❗ true in production
				.path("/")
				.maxAge(Duration.ofDays(7))
				.sameSite("Lax")
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		Map<String, Object> userInfo = new HashMap<>();
		userInfo.put("email", userObj.getEmail());
		userInfo.put("username", userObj.getUsername());
		userInfo.put("gender", userObj.getGender());
		userInfo.put("role", "USER");
		userInfo.put("accessType", userObj.getAccessType());
		userInfo.put("currentLevel", userObj.getCurrentLevel());
		userInfo.put("purchasedLevel", userObj.getPurchasedLevel());

		return ResponseEntity.ok(userInfo);
	}



	@PostMapping("/loginprofessor")
	

	public ResponseEntity<?> loginProfessor(@RequestBody Professor professor, HttpServletResponse response) throws Exception {
		String email = professor.getEmail();
		String password = professor.getPassword();

		Professor foundProfessor = professorService.fetchProfessorByEmailAndPassword(email, password);
		if (foundProfessor == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}

		String token = jwtUtil.generateToken(foundProfessor.getEmail(), "PROFESSOR");

		ResponseCookie cookie = ResponseCookie.from("jwt", token)
				.httpOnly(true)
				.secure(true) // ✅ false for localhost, true in prod
				.path("/")
				.maxAge(Duration.ofDays(7))
				.sameSite("Lax")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		// ✅ Send only needed professor info (decoded)
		Map<String, Object> responseData = new HashMap<>();
		responseData.put("email", foundProfessor.getEmail());
		responseData.put("professorName", foundProfessor.getProfessorname());
		responseData.put("gender", foundProfessor.getGender());
		responseData.put("status", foundProfessor.getStatus());
		responseData.put("role", "PROFESSOR");

		return ResponseEntity.ok(responseData);
	}



	@PostMapping("/loginadmin")
	public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> request, HttpServletResponse response) {
		String email = request.get("email");
		String password = request.get("password");



		if (!adminEmail.equals(email)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
		}

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		if (!encoder.matches(password, adminHashedPassword)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
		}

		String token = jwtUtil.generateToken(email, "ADMIN");

		ResponseCookie cookie = ResponseCookie.from("jwt", token)
				.httpOnly(true)
				.secure(true) // 🔴 TRUE en prod
				.path("/")
				.maxAge(Duration.ofDays(7))
				.sameSite("Lax")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		Map<String, String> body = new HashMap<>();
		body.put("email", email);
		body.put("role", "ADMIN");

		return ResponseEntity.ok(body);
	}








	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
		try {

			ResponseCookie cookie = ResponseCookie.from("jwt", null)
					.httpOnly(true)
					.secure(true) // Set to true in production
					.path("/")
					.maxAge(0)
					.sameSite("Strict")
					.build();
			response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


			Map<String, String> responseBody = new HashMap<>();
			responseBody.put("message", "Logout successful");
			return ResponseEntity.ok(responseBody);
		} catch (Exception e) {

			Map<String, String> responseBody = new HashMap<>();
			responseBody.put("message", "Logout failed: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
		}
	}


	@PostMapping("/forgot-password")
	

	public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) throws Exception {
		Map<String, String> response = new HashMap<>();
		String email = request.get("email");
		String token = UUID.randomUUID().toString();

		User user = userService.fetchUserByEmail(email);
		Professor professor = professorService.fetchProfessorByEmail(email);

		if (user != null) {
			userService.updateResetPasswordToken(token, email);
			emailService.sendResetEmail(email, token);
			response.put("message", "Reset link sent to your email.");
			return ResponseEntity.ok(response);
		} else if (professor != null) {
			professorService.updateResetPasswordToken(token, email);
			emailService.sendResetEmail(email, token);
			response.put("message", "Reset link sent to your email.");
			return ResponseEntity.ok(response);
		} else {
			response.put("message", "No account found with this email.");
			return ResponseEntity.status(404).body(response);
		}
	}


	@PostMapping("/reset-password")
	

	public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) throws Exception {
		String token = request.get("token");
		String newPassword = request.get("newPassword");

		User user = userService.getByResetPasswordToken(token);
		Professor professor = professorService.getByResetPasswordToken(token);

		Map<String, String> response = new HashMap<>();
		if (user != null) {
			String oldPassword = user.getPassword();
			response.put("oldPassword", oldPassword);
			if (oldPassword.equals(newPassword)) {
				response.put("message", "New password must be different from the old one.");
				return ResponseEntity.badRequest().body(response);
			}
			userService.updatePassword(user, newPassword);
			response.put("message", "Password reset successfully.");
			return ResponseEntity.ok(response);
		} else if (professor != null) {
			String oldPassword = professor.getPassword();
			response.put("oldPassword", oldPassword);
			if (oldPassword.equals(newPassword)) {
				response.put("message", "New password must be different from the old one.");
				return ResponseEntity.badRequest().body(response);
			}
			professorService.updatePassword(professor, newPassword);
			response.put("message", "Password reset successfully.");
			return ResponseEntity.ok(response);
		} else {
			throw new Exception("Invalid or expired token.");
		}
}


	@GetMapping("/auth/status")
	

	public ResponseEntity<?> getUserStatus(HttpServletRequest request) {
		String token = jwtUtil.extractTokenFromRequest(request);
		if (token == null || !jwtUtil.validateToken(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
		}

		String email = jwtUtil.extractEmail(token);
		String role = jwtUtil.extractRole(token);
		String accessType = userService.getAccessType(email);
		String currentLevel = userService.getCurrentLevel(email);
		String username=userService.getUsername(email);
		String gender = userService.getGender(email);

		Map<String, Object> response = new HashMap<>();
		response.put("email", email);
		response.put("role", role);
		response.put("accessType", accessType);
		response.put("currentLevel", currentLevel);
		response.put("username", username);
		response.put("gender", gender);

		return ResponseEntity.ok(response);
	}

}