package com.application.services;

import com.application.DTOs.PaymentDTO;
import com.application.model.Payment;
import com.application.model.User;
import com.application.repository.PaymentRepository;
import com.application.repository.UserRepository;
import com.iyzipay.Options;
import com.iyzipay.model.Address;
import com.iyzipay.model.BasketItem;
import com.iyzipay.model.Buyer;
import com.iyzipay.model.CheckoutFormInitialize;
import com.iyzipay.model.BasketItemType;
import com.iyzipay.model.Currency;
import com.iyzipay.model.PaymentChannel;
import com.iyzipay.model.PaymentGroup;

import com.iyzipay.model.CheckoutForm;
import com.iyzipay.request.RetrieveCheckoutFormRequest;


import com.iyzipay.request.CreateCheckoutFormInitializeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private Options iyzicoOptions;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crée un paiement et retourne le token Checkout Form Iyzipay pour le frontend
     */
    public String createPayment(PaymentDTO dto) {

        // Vérification utilisateur
        User user = userRepository.findByEmail(dto.getEmail());
        if (user == null) throw new RuntimeException("User not found");

        BigDecimal price = getPriceInTry(dto.getAccessType());

        if (dto.getBasketItems() == null || dto.getBasketItems().isEmpty()) {
            throw new RuntimeException("Basket items cannot be null or empty");
        }

        String conversationId = UUID.randomUUID().toString();

        // =========================
        // BUYER
        // =========================
        Buyer buyer = new Buyer();
        buyer.setId(user.getUserid());
        buyer.setName(user.getUsername());
        buyer.setSurname("Test"); // ou récupérer vrai nom
        buyer.setIdentityNumber("11111111111"); // obligatoire
        buyer.setEmail(user.getEmail());
        buyer.setGsmNumber(user.getMobile());
        buyer.setRegistrationAddress(user.getAddress());
        buyer.setCity("Istanbul");
        buyer.setCountry("Turkey");
        buyer.setZipCode("34000");
        buyer.setIp("85.34.78.112");

        // =========================
        // ADDRESSES
        // =========================
        Address billing = new Address();
        billing.setContactName(user.getUsername());
        billing.setCity("Istanbul");
        billing.setCountry("Turkey");
        billing.setAddress(user.getAddress());
        billing.setZipCode("34000");

        Address shipping = new Address();
        shipping.setContactName(user.getUsername());
        shipping.setCity("Istanbul");
        shipping.setCountry("Turkey");
        shipping.setAddress(user.getAddress());
        shipping.setZipCode("34000");

        // =========================
        // BASKET ITEMS
        // =========================
        List<BasketItem> basketItems = dto.getBasketItems().stream().map(b -> {
            BasketItem item = new BasketItem();
            item.setId(b.getId());
            item.setName(b.getName());
            item.setCategory1("Education");
            item.setItemType(BasketItemType.VIRTUAL.name());
            item.setPrice(price);
            return item;
        }).collect(Collectors.toList());

        // =========================
        // CREATE CHECKOUT FORM REQUEST
        // =========================
        CreateCheckoutFormInitializeRequest request = new CreateCheckoutFormInitializeRequest();
        request.setLocale("tr");
        request.setConversationId(conversationId);
        request.setPrice(price);
        request.setPaidPrice(price);
        request.setCurrency(Currency.TRY.name());
        request.setCallbackUrl("https://englishstar-online.com/api/payment/callback");



        request.setBuyer(buyer);
        request.setBillingAddress(billing);
        request.setShippingAddress(shipping);
        request.setBasketItems(basketItems);

        // =========================
        // CALL IYZIPAY
        // =========================
        CheckoutFormInitialize checkoutFormInitialize =
                CheckoutFormInitialize.create(request, iyzicoOptions);
        System.out.println("=== IY ZICO CHECKOUT INIT ===");
        System.out.println("status        = " + checkoutFormInitialize.getStatus());
        System.out.println("errorCode     = " + checkoutFormInitialize.getErrorCode());
        System.out.println("errorMessage  = " + checkoutFormInitialize.getErrorMessage());
        System.out.println("locale        = " + checkoutFormInitialize.getLocale());
        System.out.println("conversationId= " + checkoutFormInitialize.getConversationId());
        System.out.println("html length   = " +
                (checkoutFormInitialize.getCheckoutFormContent() != null
                        ? checkoutFormInitialize.getCheckoutFormContent().length()
                        : 0));
        System.out.println("=== END IY ZICO CHECKOUT INIT ===");

        // =========================
        // SAVE PAYMENT LOCAL
        // =========================
        Payment payment = new Payment();
        payment.setConversationId(conversationId);
        payment.setAmount(price.doubleValue());
        payment.setStatus("created"); // paiement pas encore confirmé
        payment.setSuccess(false);
        payment.setAccessType(dto.getAccessType());
        payment.setUser(user);
        paymentRepository.save(payment);

        // =========================
        // RETURN TOKEN FOR FRONTEND
        // =========================
        // =========================
// RETURN PAYMENT PAGE URL FOR FRONTEND
// =========================
        // =========================
// RETURN PAYMENT PAGE URL FOR FRONTEND
// =========================
        // =========================
// RETURN PAYMENT PAGE URL FOR FRONTEND
// =========================
        if (!"success".equalsIgnoreCase(checkoutFormInitialize.getStatus())) {
            throw new RuntimeException("Iyzico init failed: " + checkoutFormInitialize.getErrorMessage());
        }

        String html = checkoutFormInitialize.getCheckoutFormContent();
        String token = extractToken(html);
        return "https://cpp.iyzipay.com?token=" + token + "&lang=tr";





    }

    private String extractToken(String html) {
        if (html == null) {
            throw new RuntimeException("Iyzico HTML is null");
        }

        String marker = "token:\"";
        int idx = html.indexOf(marker);
        if (idx == -1) {
            throw new RuntimeException("token not found in Iyzico HTML");
        }

        int start = idx + marker.length();
        int end = html.indexOf("\"", start);
        if (end == -1) {
            throw new RuntimeException("token end quote not found in Iyzico HTML");
        }

        return html.substring(start, end);
    }

    private String extractCppUrl(String html) {
        if (html == null) {
            throw new RuntimeException("Iyzico HTML is null");
        }

        String marker = "https://cpp.iyzipay.com";
        int idx = html.indexOf(marker);
        if (idx == -1) {
            throw new RuntimeException("cpp.iyzipay URL not found in HTML");
        }

        int end = html.indexOf("\"", idx);
        if (end == -1) {
            end = html.length();
        }

        return html.substring(idx, end);
    }


    @Transactional
    public void processIyzicoCallback(String token) {
        // 1) Retrieve from iyzico
        RetrieveCheckoutFormRequest request = new RetrieveCheckoutFormRequest();
        request.setToken(token);

        CheckoutForm checkoutForm = CheckoutForm.retrieve(request, iyzicoOptions);


        // 2) Check status
        if (!"success".equalsIgnoreCase(checkoutForm.getPaymentStatus())) {
            // TODO: optionally update local Payment as failed
            return;
        }

        // 3) Load local Payment + User
        String conversationId = checkoutForm.getConversationId();
        Payment payment = paymentRepository.findByConversationId(conversationId);
        if (payment == null) {
            throw new RuntimeException("Payment not found for conversationId: " + conversationId);
        }

        User user = payment.getUser();

        // 4) Build minimal DTO for business logic
        PaymentDTO dto = new PaymentDTO();
        dto.setEmail(user.getEmail());
        dto.setAccessType(payment.getAccessType());

        // 5) Update Payment entity
        payment.setStatus("success");
        payment.setSuccess(true);
        payment.setIyzicoPaymentId(checkoutForm.getPaymentId());
        paymentRepository.save(payment);

        // 6) Apply access logic
        handleSuccessfulPayment(user, dto);
    }


    @Transactional
    public void handleSuccessfulPayment(User user, PaymentDTO dto) {
        user.setAccessType(dto.getAccessType());

        // ===== FULL ACCESS =====
        if ("Full".equalsIgnoreCase(dto.getAccessType())) {
            if (!user.isPaymentRequired() && user.isQuizCompleted()) {
                user.setAccessType("Full");
                String nextLevel = getNextLevel(user.getCurrentLevel());
                if (nextLevel != null) {
                    user.addPurchasedLevel(nextLevel);
                    user.setCurrentLevel(nextLevel);
                }
                user.setPaymentRequired(false);
                user.setQuizCompleted(false);
                userRepository.save(user);
            } else {
                user.setAccessType("Full");
                user.setPaymentRequired(false);
                user.setQuizCompleted(false);
                userRepository.save(user);
            }
        }

        // ===== SINGLE ACCESS =====
        if ("Single".equalsIgnoreCase(dto.getAccessType())) {
            if (user.isPaymentRequired() || !user.isQuizCompleted()) {
                user.setAccessType("Single");
            } else {
                String nextLevel = getNextLevel(user.getCurrentLevel());
                if (nextLevel != null) {
                    user.addPurchasedLevel(nextLevel);
                    user.setCurrentLevel(nextLevel);
                }
                user.setAccessType("Single");
            }
            user.setPaymentRequired(false);
            user.setQuizCompleted(false);
            userRepository.save(user);
        }
    }

    private BigDecimal getPriceInTry(String accessType) {
        if ("Full".equalsIgnoreCase(accessType)) return BigDecimal.valueOf(12599);
        if ("Single".equalsIgnoreCase(accessType)) return BigDecimal.valueOf(2479);
        throw new IllegalArgumentException("Invalid access type");
    }

    private String getNextLevel(String currentLevel) {
        List<String> levels = List.of("A1", "A2", "B1", "B2", "C1", "C2");
        int index = levels.indexOf(currentLevel.toUpperCase());
        if (index >= 0 && index < levels.size() - 1) return levels.get(index + 1);
        return null;
    }
}
