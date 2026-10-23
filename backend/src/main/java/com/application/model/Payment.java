package com.application.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String iyzicoPaymentId; // Iyzico payment ID
    private String status;          // success / failure / pending
    private String conversationId;  // unique for each payment
    private double amount;
    private String currency = "TRY";
    private String accessType;      // Single or Full
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean success = false;

    @ManyToOne
    private User user;
}
