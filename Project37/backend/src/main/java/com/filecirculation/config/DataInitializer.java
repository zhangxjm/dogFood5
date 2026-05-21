package com.filecirculation.config;

import com.filecirculation.entity.User;
import com.filecirculation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("123456");
            admin.setRealName("管理员");
            admin.setDepartment("行政部");
            userRepository.save(admin);

            User zhangsan = new User();
            zhangsan.setUsername("zhangsan");
            zhangsan.setPassword("123456");
            zhangsan.setRealName("张三");
            zhangsan.setDepartment("技术部");
            userRepository.save(zhangsan);

            User lisi = new User();
            lisi.setUsername("lisi");
            lisi.setPassword("123456");
            lisi.setRealName("李四");
            lisi.setDepartment("财务部");
            userRepository.save(lisi);

            User wangwu = new User();
            wangwu.setUsername("wangwu");
            wangwu.setPassword("123456");
            wangwu.setRealName("王五");
            wangwu.setDepartment("市场部");
            userRepository.save(wangwu);
        }
    }
}
