package com.teashop.controller;

import com.teashop.common.Result;
import com.teashop.entity.Drink;
import com.teashop.service.DrinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drinks")
@CrossOrigin(origins = "*")
public class DrinkController {

    @Autowired
    private DrinkService drinkService;

    @GetMapping
    public Result<List<Drink>> getAllDrinks() {
        return Result.success(drinkService.getAllDrinks());
    }

    @GetMapping("/available")
    public Result<List<Drink>> getAvailableDrinks() {
        return Result.success(drinkService.getAvailableDrinks());
    }

    @GetMapping("/category/{category}")
    public Result<List<Drink>> getDrinksByCategory(@PathVariable Integer category) {
        return Result.success(drinkService.getDrinksByCategory(category));
    }

    @GetMapping("/{id}")
    public Result<Drink> getDrinkById(@PathVariable Long id) {
        return drinkService.getDrinkById(id)
                .map(Result::success)
                .orElse(Result.error("Drink not found"));
    }

    @PostMapping
    public Result<Drink> createDrink(@RequestBody Drink drink) {
        return Result.success(drinkService.createDrink(drink));
    }

    @PutMapping("/{id}")
    public Result<Drink> updateDrink(@PathVariable Long id, @RequestBody Drink drink) {
        try {
            return Result.success(drinkService.updateDrink(id, drink));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteDrink(@PathVariable Long id) {
        drinkService.deleteDrink(id);
        return Result.success();
    }
}