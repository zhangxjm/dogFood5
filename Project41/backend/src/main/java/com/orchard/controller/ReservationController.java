package com.orchard.controller;

import com.orchard.common.Result;
import com.orchard.entity.Reservation;
import com.orchard.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public Result<Reservation> create(@RequestBody Reservation reservation) {
        try {
            return Result.success(reservationService.create(reservation));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/checkin/{reservationNo}")
    public Result<Reservation> checkin(@PathVariable String reservationNo) {
        try {
            return Result.success(reservationService.checkin(reservationNo));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/list/{phone}")
    public Result<List<Reservation>> list(@PathVariable String phone) {
        return Result.success(reservationService.getByPhone(phone));
    }
}
