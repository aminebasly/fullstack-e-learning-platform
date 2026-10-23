package com.application.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.application.model.Professor;
import com.application.services.ProfessorService;

@RestController
public class ProfessorController 
{	
	@Autowired
	private ProfessorService professorService;
	

	
	
	@GetMapping("/professorlist")
	

	public ResponseEntity<List<Professor>> getProfessorList() throws Exception
	{
		List<Professor> professors = professorService.getAllProfessors();
		return new ResponseEntity<List<Professor>>(professors, HttpStatus.OK);
	}
	

	
	@GetMapping("/professorlistbyemail/{email}")
	

	public ResponseEntity<List<Professor>> getProfessorListByEmail(@PathVariable String email) throws Exception
	{
		List<Professor> professors = professorService.getProfessorsByEmail(email);
		return new ResponseEntity<List<Professor>>(professors, HttpStatus.OK);
	}
	
	@PostMapping("/addProfessor")
	

	public Professor addNewProfessor(@RequestBody Professor professor) throws Exception
	{
		Professor professorObj = null;
		String newID = getNewID();
		professor.setProfessorid(newID);
		professorObj = professorService.addNewProfessor(professor);
		professorService.updateStatus(professor.getEmail());
		return professorObj;
	}
	

	
	@GetMapping("/acceptstatus/{email}")
	

	public ResponseEntity<List<String>> updateStatus(@PathVariable String email) throws Exception
	{
		professorService.updateStatus(email);
		List<String> al=new ArrayList<>();
		al.add("accepted");
		return new ResponseEntity<List<String>>(al,HttpStatus.OK);
	}
	
	@GetMapping("/rejectstatus/{email}")
	

	public ResponseEntity<List<String>> rejectStatus(@PathVariable String email) throws Exception
	{
		professorService.rejectStatus(email);
		List<String> al=new ArrayList<>();
		al.add("rejected");
		return new ResponseEntity<List<String>>(al,HttpStatus.OK);
	}
	
	@GetMapping("/professorprofileDetails/{email}")
	

	public ResponseEntity<List<Professor>> getProfileDetails(@PathVariable String email) throws Exception
	{
		List<Professor> professors = professorService.fetchProfileByEmail(email);
		return new ResponseEntity<List<Professor>>(professors, HttpStatus.OK);
	}
	
	@PutMapping("/updateprofessor")
	

	public ResponseEntity<Professor> updateProfessorProfile(@RequestBody Professor professor) throws Exception
	{
		Professor professorobj = professorService.updateProfessorProfile(professor);
		return new ResponseEntity<Professor>(professorobj, HttpStatus.OK);
	}
	
	@GetMapping("/gettotalprofessors")
	

	public ResponseEntity<List<Integer>> getTotalProfessors() throws Exception
	{
		List<Professor> professors = professorService.getAllProfessors();
		List<Integer> professorsCount = new ArrayList<>();
		professorsCount.add(professors.size());
		return new ResponseEntity<List<Integer>>(professorsCount, HttpStatus.OK);
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

	@GetMapping("/search")
	public List<Professor> searchProfessors(@RequestParam String keyword) {
		return professorService.searchProfessors(keyword);
	}

	// ✏️ Update professor by email
	@PutMapping("/{email}")
	public Professor updateProfessor(@PathVariable String email, @RequestBody Professor updatedProfessor) {
		return professorService.updateProfessor(email, updatedProfessor);
	}

	// ❌ Delete professor by email
	@DeleteMapping("/{email}")
	public String deleteProfessor(@PathVariable String email) {
		try {
			professorService.deleteProfessorByEmail(email);
			return "Professor deleted successfully";
		} catch (Exception e) {
			return "Error deleting professor: " + e.getMessage();
		}
	}
	
}
