package com.teashop.repository;

import com.teashop.entity.Drink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long> {

    List<Drink> findByAvailableTrue();

    List<Drink> findByCategoryAndAvailableTrue(Integer category);
}