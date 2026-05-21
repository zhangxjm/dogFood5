package com.taskmanager.config;

import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@taskmanager.com");
            admin.setFullName("系统管理员");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("========================================");
            System.out.println("默认管理员账号已创建:");
            System.out.println("用户名: admin");
            System.out.println("密码: admin123");
            System.out.println("========================================");
        }
    }
}
