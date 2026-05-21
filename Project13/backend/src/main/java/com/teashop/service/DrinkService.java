package com.teashop.service;

import com.teashop.entity.Drink;
import com.teashop.repository.DrinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DrinkService {

    @Autowired
    private DrinkRepository drinkRepository;

    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }

    public List<Drink> getAvailableDrinks() {
        return drinkRepository.findByAvailableTrue();
    }

    public List<Drink> getDrinksByCategory(Integer category) {
        return drinkRepository.findByCategoryAndAvailableTrue(category);
    }

    public Optional<Drink> getDrinkById(Long id) {
        return drinkRepository.findById(id);
    }

    @Transactional
    public Drink createDrink(Drink drink) {
        return drinkRepository.save(drink);
    }

    @Transactional
    public Drink updateDrink(Long id, Drink drinkDetails) {
        return drinkRepository.findById(id)
                .map(drink -> {
                    drink.setName(drinkDetails.getName());
                    drink.setDescription(drinkDetails.getDescription());
                    drink.setPrice(drinkDetails.getPrice());
                    drink.setImage(drinkDetails.getImage());
                    drink.setCategory(drinkDetails.getCategory());
                    drink.setAvailable(drinkDetails.getAvailable());
                    return drinkRepository.save(drink);
                })
                .orElseThrow(() -> new RuntimeException("Drink not found"));
    }

    @Transactional
    public void deleteDrink(Long id) {
        drinkRepository.deleteById(id);
    }
}