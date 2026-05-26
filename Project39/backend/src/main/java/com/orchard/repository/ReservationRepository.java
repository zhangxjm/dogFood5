package com.orchard.repository;

import com.orchard.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Reservation findByOrderNo(String orderNo);

    @Query("SELECT r FROM Reservation r WHERE r.visitorPhone = :phone ORDER BY r.createTime DESC")
    List<Reservation> findByVisitorPhone(@Param("phone") String phone);

    @Query("SELECT r FROM Reservation r WHERE r.timeSlotId = :timeSlotId")
    List<Reservation> findByTimeSlotId(@Param("timeSlotId") Long timeSlotId);
}
