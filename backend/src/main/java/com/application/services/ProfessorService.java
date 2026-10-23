package com.application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.application.model.Professor;
import com.application.repository.ProfessorRepository;

import javax.transaction.Transactional;

@Service
public class ProfessorService 
{
	@Autowired
	private ProfessorRepository professorRepo;
	
	public Professor saveProfessor(Professor professor)
	{
		return professorRepo.save(professor);
	}
	
	public Professor addNewProfessor(Professor professor)
	{
		return professorRepo.save(professor);
	}
	
	public Professor updateProfessorProfile(Professor professor)
	{
		return professorRepo.save(professor);
	}
	
	public List<Professor> getAllProfessors()
	{
		return (List<Professor>)professorRepo.findAll();
	}
	
	public List<Professor> getProfessorListByEmail(String email) 
	{
		return (List<Professor>)professorRepo.findProfessorListByEmail(email);
	}
	
	public Professor fetchProfessorByEmail(String email)
	{
		return professorRepo.findByEmail(email);
	}
	
	public Professor fetchProfessorByProfessorname(String professorname)
	{
		return professorRepo.findByProfessorname(professorname);
	}

	public Professor fetchProfessorByEmailAndPassword(String email, String password) {
		Professor professor = professorRepo.findByEmail(email);
		if (professor != null && password.equals(professor.getPassword())) {
			return professor;
		}
		return null;
	}
	
	public List<Professor> fetchProfileByEmail(String email)
	{
		return (List<Professor>)professorRepo.findProfileByEmail(email);
	}

	public void updateStatus(String email) 
	{
		professorRepo.updateStatus(email);
	}

	public void rejectStatus(String email) 
	{
		professorRepo.rejectStatus(email);
	}

	public List<Professor> getProfessorsByEmail(String email)
	{
		return professorRepo.findProfessorListByEmail(email);
	}
	public void updateResetPasswordToken(String token, String email) throws Exception {
		Professor professor = professorRepo.findByEmail(email);
		if (professor != null) {
			professor.setResetPasswordToken(token);
			professorRepo.save(professor);
		} else {
			throw new Exception("Could not find any professor with the email " + email);
		}
	}

	public Professor getByResetPasswordToken(String token) {
		return professorRepo.findByResetPasswordToken(token);
	}

	public void updatePassword(Professor professor, String newPassword) {
		professor.setPassword(newPassword); // Assuming you're using password encoding
		professor.setResetPasswordToken(null);
		professorRepo.save(professor);
	}


	// 🔍 Search by keyword (name, email, or professor ID)
	public List<Professor> searchProfessors(String keyword) {
		return professorRepo
				.findByProfessornameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
	}

	// ✅ Update professor by email
	@Transactional
	public Professor updateProfessor(String email, Professor updatedProfessor) {
		Professor existing = professorRepo.findByEmail(email);
		if (existing == null) {
			throw new RuntimeException("Professor not found with email: " + email); // Consider a custom exception
		}

		if (updatedProfessor.getProfessorname() != null)
			existing.setProfessorname(updatedProfessor.getProfessorname());

		if (updatedProfessor.getProfessorid() != null)
			existing.setProfessorid(updatedProfessor.getProfessorid());

		if (updatedProfessor.getDegreecompleted() != null)
			existing.setDegreecompleted(updatedProfessor.getDegreecompleted());

		if (updatedProfessor.getInstitutionname() != null)
			existing.setInstitutionname(updatedProfessor.getInstitutionname());

		if (updatedProfessor.getDepartment() != null)
			existing.setDepartment(updatedProfessor.getDepartment());

		if (updatedProfessor.getExperience() != null)
			existing.setExperience(updatedProfessor.getExperience());

		if (updatedProfessor.getMobile() != null)
			existing.setMobile(updatedProfessor.getMobile());

		if (updatedProfessor.getGender() != null)
			existing.setGender(updatedProfessor.getGender());

		if (updatedProfessor.getStatus() != null)
			existing.setStatus(updatedProfessor.getStatus());

		if (updatedProfessor.getPassword() != null)
			existing.setPassword(updatedProfessor.getPassword());




		return professorRepo.save(existing);
	}

	// ❌ Delete professor by email
	@Transactional
	public void deleteProfessorByEmail(String email) {

		professorRepo.deleteByEmail(email);
	}


}