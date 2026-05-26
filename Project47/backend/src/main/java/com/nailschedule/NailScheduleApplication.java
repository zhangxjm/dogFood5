package com.nailschedule;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.nailschedule.mapper")
public class NailScheduleApplication {
    public static void main(String[] args) {
        SpringApplication.run(NailScheduleApplication.class, args);
    }
}
