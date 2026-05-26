package com.company.teambuilding.controller;

import com.company.teambuilding.common.Result;
import com.company.teambuilding.entity.Expense;
import com.company.teambuilding.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/plan/{planId}")
    public Result<List<Expense>> findByPlanId(@PathVariable Long planId) {
        return Result.success(expenseService.findByPlanId(planId));
    }

    @GetMapping("/{id}")
    public Result<Expense> findById(@PathVariable Long id) {
        Optional<Expense> expense = expenseService.findById(id);
        return expense.map(Result::success).orElseGet(() -> Result.error("Expense not found"));
    }

    @PostMapping
    public Result<Expense> create(@RequestBody Expense expense) {
        return Result.success(expenseService.save(expense));
    }

    @PutMapping("/{id}")
    public Result<Expense> update(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        return Result.success(expenseService.save(expense));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        expenseService.delete(id);
        return Result.success();
    }
}
