package com.jushas.manager;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.jushas.manager.mapper")
public class JushasManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(JushasManagerApplication.class, args);
    }
}
