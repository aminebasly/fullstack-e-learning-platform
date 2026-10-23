package com.application.DTOs;

import com.application.DTOs.BasketItemDTO;
import lombok.Data;
import java.util.List;

@Data
public class PaymentDTO {
    private String email;         // user email
    private double amount;        // payment amount
    private String accessType;    // Single or Full
    private String name;          // user name
    private String phone;         // user phone
    private String address;       // user address
    private List<BasketItemDTO> basketItems;
}
