package com.application.controller;

import com.application.DTOs.PaymentDTO;
import com.application.model.Payment;
import com.application.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


import java.util.List;

@RestController
@RequestMapping("/api/payment")
 // allow requests from your Angular frontend
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a new payment
     * @param dto PaymentDTO from frontend (email, amount, accessType, basketItems)
     * @return saved Payment object with Iyzico payment ID
     */
    @PostMapping("/checkout")
    public String createPayment(@RequestBody PaymentDTO dto) {
        return paymentService.createPayment(dto);
    }

    @PostMapping("/callback")
    public String iyzicoCallback(@RequestParam("token") String token) {
        paymentService.processIyzicoCallback(token);
        // later you can return redirect to Angular route if you want
        return "OK";
    }





}
