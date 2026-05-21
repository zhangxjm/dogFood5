package com.stationery;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.stationery.mapper")
public class StationeryApplication {
    public static void main(String[] args) {
        SpringApplication.run(StationeryApplication.class, args);
    }
}
