package com.freshfood;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.freshfood.mapper")
public class FreshFoodApplication {
    public static void main(String[] args) {
        SpringApplication.run(FreshFoodApplication.class, args);
    }
}
