package com.company.teambuilding.repository;

import com.company.teambuilding.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByPlanIdOrderByExpenseDateDesc(Long planId);
    void deleteByPlanId(Long planId);
    
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.planId = ?1")
    BigDecimal sumAmountByPlanId(Long planId);
}
