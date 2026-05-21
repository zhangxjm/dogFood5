package com.snack.controller;

import com.snack.dto.Result;
import com.snack.dto.SnackDTO;
import com.snack.entity.Snack;
import com.snack.service.SnackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/snacks")
public class SnackController {

    @Autowired
    private SnackService snackService;

    @GetMapping
    public Result<List<Snack>> list() {
        return Result.success(snackService.listAll());
    }

    @GetMapping("/{id}")
    public Result<Snack> getById(@PathVariable Long id) {
        return snackService.getById(id)
                .map(Result::success)
                .orElse(Result.error("小吃不存在"));
    }

    @PostMapping
    public Result<Snack> create(@Valid @RequestBody SnackDTO dto) {
        return Result.success(snackService.create(dto));
    }

    @PutMapping("/{id}")
    public Result<Snack> update(@PathVariable Long id, @Valid @RequestBody SnackDTO dto) {
        return Result.success(snackService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        snackService.delete(id);
        return Result.success();
    }
}
