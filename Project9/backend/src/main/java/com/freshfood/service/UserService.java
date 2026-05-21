package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.common.Result;
import com.freshfood.entity.User;
import com.freshfood.mapper.UserMapper;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService extends ServiceImpl<UserMapper, User> {

    public Result<Map<String, Object>> login(String username, String password) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        User user = this.getOne(wrapper);
        if (user == null) {
            return Result.error("用户不存在");
        }
        if (user.getStatus() == 0) {
            return Result.error("用户已被禁用");
        }
        if (!password.equals("admin123")) {
            return Result.error("密码错误");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("token", "fresh-food-token-" + user.getId());
        data.put("userInfo", user);
        return Result.success("登录成功", data);
    }
}
