package com.snack.repository;

import com.snack.entity.DailyStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyStatRepository extends JpaRepository<DailyStat, Long> {
    Optional<DailyStat> findByStatDate(LocalDate statDate);
    List<DailyStat> findByStatDateBetweenOrderByStatDateDesc(LocalDate startDate, LocalDate endDate);
}
