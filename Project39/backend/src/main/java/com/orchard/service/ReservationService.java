package com.orchard.service;

import com.orchard.entity.Reservation;

import java.util.List;

public interface ReservationService {
    Reservation createReservation(Reservation reservation);
    Reservation getReservationByOrderNo(String orderNo);
    List<Reservation> getReservationsByPhone(String phone);
    Reservation verifyReservation(String orderNo);
    Reservation cancelReservation(String orderNo);
    List<Reservation> getAllReservations();
}
