package com.snack.config;

import com.snack.entity.Snack;
import com.snack.repository.SnackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SnackRepository snackRepository;

    @Override
    public void run(String... args) {
        if (snackRepository.count() == 0) {
            List<Snack> defaultSnacks = Arrays.asList(
                    createSnack("烤肠", 3.0, "香喷喷的烤肠"),
                    createSnack("手抓饼", 6.0, "美味手抓饼"),
                    createSnack("臭豆腐", 8.0, "长沙臭豆腐"),
                    createSnack("炸串", 5.0, "各种炸串"),
                    createSnack("煎饼果子", 7.0, "正宗煎饼果子"),
                    createSnack("凉皮", 6.0, "清爽凉皮"),
                    createSnack("肉夹馍", 8.0, "陕西肉夹馍"),
                    createSnack("关东煮", 10.0, "日式关东煮")
            );
            snackRepository.saveAll(defaultSnacks);
        }
    }

    private Snack createSnack(String name, double price, String description) {
        Snack snack = new Snack();
        snack.setName(name);
        snack.setPrice(price);
        snack.setDescription(description);
        snack.setActive(true);
        return snack;
    }
}
