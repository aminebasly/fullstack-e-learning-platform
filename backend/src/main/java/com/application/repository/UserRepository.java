package com.application.repository;

import java.util.List;
import java.util.Optional;

import com.application.model.Content;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import com.application.model.User;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>
{
	
    public User findByEmail(String email);
	void deleteByEmail(String email);
	@Modifying
	@Query("UPDATE User u SET u.lastContentVisited = null WHERE u.lastContentVisited = :content")
	void clearLastContentVisited(@Param("content") Content content);

	
	public User findByUsername(String username);
	
	public User findByEmailAndPassword(String email, String password);
	
	public List<User> findProfileByEmail(String email);
	User findByResetPasswordToken(String resetPasswordToken);

	@Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
	List<User> searchUsers(String query);

	@Query("SELECT u.lastContentVisited FROM User u WHERE u.email = :email")
	Content findLastContentVisitedByEmail(String email);

	@Query("SELECT COUNT(u) FROM User u WHERE u.accessType = 'FULL' AND u.gender = :gender")
	long countFullAccessByGender(String gender);

	// Count single access users by gender
	@Query("SELECT COUNT(u) FROM User u WHERE u.accessType = 'SINGLE' AND u.gender = :gender")
	long countSingleAccessByGender(String gender);




}