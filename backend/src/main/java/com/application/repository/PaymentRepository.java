package com.application.repository;

import com.application.model.Payment;
import com.application.model.Professor;
import com.application.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository  extends CrudRepository<Payment, Long> {
    List<Payment> findByUserEmail(String email);

    // Optional: find payments by conversationId (useful for callbacks)
    Payment findByConversationId(String conversationId);

}
