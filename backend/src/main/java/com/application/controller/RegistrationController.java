package com.application.controller;

import com.application.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.application.model.Professor;
import com.application.model.User;
import com.application.services.ProfessorService;
import com.application.services.UserService;

import javax.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RegistrationController 
{
	@Autowired
	private UserService userService;
	
	@Autowired
	private ProfessorService professorService;
	@Autowired
	private JwtUtil jwtUtil; // ✅ Fix added here


	@PostMapping("/registeruser")


	public ResponseEntity<?> registerUser(@RequestBody User user, HttpServletResponse response) throws Exception {
		String email = user.getEmail();
		if (email != null && !"".equals(email)) {
			if (userService.fetchUserByEmail(email) != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists!");
			}
		}

		user.setUserid(getNewID());
		User savedUser = userService.saveUser(user);

		// 🔐 Generate JWT token
		String token = jwtUtil.generateToken(savedUser.getEmail(), "USER");

		// 🍪 Set JWT cookie
		ResponseCookie cookie = ResponseCookie.from("jwt", token)
				.httpOnly(true)
				.secure(true) // ❗ Set to true in production
				.path("/")
				.maxAge(Duration.ofDays(7))
				.sameSite("Lax")
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		// ✅ Return user info (decoded) in response
		Map<String, Object> userInfo = new HashMap<>();
		userInfo.put("email", savedUser.getEmail());
		userInfo.put("username", savedUser.getUsername());
		userInfo.put("gender", savedUser.getGender());
		userInfo.put("role", "USER");
		userInfo.put("accessType", savedUser.getAccessType());     // ✅ include if exists
		userInfo.put("currentLevel", savedUser.getCurrentLevel()); // ✅ include if exists
		userInfo.put("purchasedLevel", savedUser.getPurchasedLevel()); // optional

		return ResponseEntity.ok(userInfo);
	}



	@PostMapping("/registerprofessor")
	

	public ResponseEntity<?> registerProfessor(@RequestBody Professor professor, HttpServletResponse response) throws Exception {
		String email = professor.getEmail();
		if (email != null && !"".equals(email)) {
			if (professorService.fetchProfessorByEmail(email) != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Professor already exists!");
			}
		}

		professor.setProfessorid(getNewID());
		Professor savedProfessor = professorService.saveProfessor(professor);

		String token = jwtUtil.generateToken(savedProfessor.getEmail(), "PROFESSOR");

		ResponseCookie cookie = ResponseCookie.from("jwt", token)
				.httpOnly(true)
				.secure(true) // ✅ false for localhost, true in prod
				.path("/")
				.maxAge(Duration.ofDays(7))
				.sameSite("Lax")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		// ✅ Send clean decoded data
		Map<String, Object> responseData = new HashMap<>();
		responseData.put("email", savedProfessor.getEmail());
		responseData.put("professorName", savedProfessor.getProfessorname());
		responseData.put("gender", savedProfessor.getGender());
		responseData.put("status", savedProfessor.getStatus()); // APPROVED / PENDING / REJECTED
		responseData.put("role", "PROFESSOR");

		return ResponseEntity.ok(responseData);
	}



	public String getNewID()
	{
		String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+"0123456789"+"abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) 
        {
            int index = (int)(AlphaNumericString.length() * Math.random());
            sb.append(AlphaNumericString.charAt(index));
        }
        return sb.toString();
	}
}