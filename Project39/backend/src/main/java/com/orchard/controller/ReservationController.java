package com.orchard.controller;

import com.orchard.entity.Reservation;
import com.orchard.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(reservation));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/order/{orderNo}")
    public ResponseEntity<Reservation> getReservationByOrderNo(@PathVariable String orderNo) {
        Reservation reservation = reservationService.getReservationByOrderNo(orderNo);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<Reservation>> getReservationsByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(reservationService.getReservationsByPhone(phone));
    }

    @PostMapping("/verify/{orderNo}")
    public ResponseEntity<?> verifyReservation(@PathVariable String orderNo) {
        try {
            return ResponseEntity.ok(reservationService.verifyReservation(orderNo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel/{orderNo}")
    public ResponseEntity<?> cancelReservation(@PathVariable String orderNo) {
        try {
            return ResponseEntity.ok(reservationService.cancelReservation(orderNo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
}
