package com.orchard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.orchard.entity.Reservation;
import com.orchard.entity.TimeSlot;
import com.orchard.mapper.ReservationMapper;
import com.orchard.service.ReservationService;
import com.orchard.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation> implements ReservationService {

    @Autowired
    private TimeSlotService timeSlotService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Reservation create(Reservation reservation) {
        TimeSlot timeSlot = timeSlotService.getById(reservation.getTimeSlotId());
        if (timeSlot == null) {
            throw new RuntimeException("时段不存在");
        }
        if (timeSlot.getStatus() != 1) {
            throw new RuntimeException("该时段已关闭");
        }
        if (timeSlot.getReservedPeople() + reservation.getPeopleCount() > timeSlot.getMaxPeople()) {
            throw new RuntimeException("该时段人数已满");
        }

        reservation.setReservationNo(generateReservationNo());
        reservation.setStatus(0);
        reservation.setCreateTime(LocalDateTime.now());
        reservation.setUpdateTime(LocalDateTime.now());
        save(reservation);

        timeSlot.setReservedPeople(timeSlot.getReservedPeople() + reservation.getPeopleCount());
        timeSlotService.updateById(timeSlot);

        return reservation;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Reservation checkin(String reservationNo) {
        LambdaQueryWrapper<Reservation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Reservation::getReservationNo, reservationNo);
        Reservation reservation = getOne(wrapper);
        if (reservation == null) {
            throw new RuntimeException("预约不存在");
        }
        if (reservation.getStatus() == 1) {
            throw new RuntimeException("该预约已核销");
        }
        if (reservation.getStatus() == 2) {
            throw new RuntimeException("该预约已取消");
        }

        reservation.setStatus(1);
        reservation.setCheckinTime(LocalDateTime.now());
        reservation.setUpdateTime(LocalDateTime.now());
        updateById(reservation);
        return reservation;
    }

    @Override
    public List<Reservation> getByPhone(String phone) {
        LambdaQueryWrapper<Reservation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Reservation::getVisitorPhone, phone)
                .orderByDesc(Reservation::getCreateTime);
        return list(wrapper);
    }

    private String generateReservationNo() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Random random = new Random();
        int suffix = random.nextInt(10000);
        return "OR" + date + String.format("%04d", suffix);
    }
}
