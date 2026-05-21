package com.orchard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.orchard.entity.Reservation;

import java.util.List;

public interface ReservationService extends IService<Reservation> {
    Reservation create(Reservation reservation);
    Reservation checkin(String reservationNo);
    List<Reservation> getByPhone(String phone);
}
