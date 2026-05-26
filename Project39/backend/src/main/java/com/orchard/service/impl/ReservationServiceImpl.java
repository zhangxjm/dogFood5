package com.orchard.service.impl;

import com.orchard.entity.Reservation;
import com.orchard.entity.TimeSlot;
import com.orchard.repository.ReservationRepository;
import com.orchard.repository.TimeSlotRepository;
import com.orchard.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Override
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        TimeSlot timeSlot = timeSlotRepository.findById(reservation.getTimeSlotId())
                .orElseThrow(() -> new RuntimeException("TimeSlot not found"));

        if (!timeSlot.getActive()) {
            throw new RuntimeException("This time slot is not available");
        }

        if (timeSlot.getBookedCount() + reservation.getVisitorCount() > timeSlot.getMaxCapacity()) {
            throw new RuntimeException("This time slot is full");
        }

        reservation.setOrderNo(generateOrderNo());
        reservation.setStatus("BOOKED");
        reservation.setCreateTime(LocalDateTime.now());

        timeSlot.setBookedCount(timeSlot.getBookedCount() + reservation.getVisitorCount());
        timeSlotRepository.save(timeSlot);

        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation getReservationByOrderNo(String orderNo) {
        return reservationRepository.findByOrderNo(orderNo);
    }

    @Override
    public List<Reservation> getReservationsByPhone(String phone) {
        return reservationRepository.findByVisitorPhone(phone);
    }

    @Override
    @Transactional
    public Reservation verifyReservation(String orderNo) {
        Reservation reservation = reservationRepository.findByOrderNo(orderNo);
        if (reservation == null) {
            throw new RuntimeException("Reservation not found");
        }
        if (!"BOOKED".equals(reservation.getStatus())) {
            throw new RuntimeException("Reservation status is invalid");
        }
        reservation.setStatus("VERIFIED");
        reservation.setVerifyTime(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public Reservation cancelReservation(String orderNo) {
        Reservation reservation = reservationRepository.findByOrderNo(orderNo);
        if (reservation == null) {
            throw new RuntimeException("Reservation not found");
        }
        if (!"BOOKED".equals(reservation.getStatus())) {
            throw new RuntimeException("Reservation cannot be cancelled");
        }

        TimeSlot timeSlot = timeSlotRepository.findById(reservation.getTimeSlotId()).orElse(null);
        if (timeSlot != null) {
            timeSlot.setBookedCount(Math.max(0, timeSlot.getBookedCount() - reservation.getVisitorCount()));
            timeSlotRepository.save(timeSlot);
        }

        reservation.setStatus("CANCELLED");
        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    private String generateOrderNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Random random = new Random();
        int randomNum = random.nextInt(10000);
        return "OR" + dateStr + String.format("%04d", randomNum);
    }
}
