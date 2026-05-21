package com.freshfood.controller;

import com.freshfood.common.Result;
import com.freshfood.entity.User;
import com.freshfood.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");
        return userService.login(username, password);
    }

    @GetMapping("/info")
    public Result<User> getInfo(@RequestHeader("token") String token) {
        String userId = token.replace("fresh-food-token-", "");
        User user = userService.getById(Long.parseLong(userId));
        user.setPassword(null);
        return Result.success(user);
    }
}
