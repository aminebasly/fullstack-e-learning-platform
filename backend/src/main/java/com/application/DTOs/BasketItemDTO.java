package com.application.DTOs;



import lombok.Data;

@Data
public class BasketItemDTO {
    private String id;
    private String name;
    private double price;
    private int quantity;
    private String category1;
    private String itemType = "PRODUCT"; // always PRODUCT
}
