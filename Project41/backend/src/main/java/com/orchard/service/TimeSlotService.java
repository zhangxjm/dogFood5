package com.orchard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.orchard.entity.TimeSlot;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService extends IService<TimeSlot> {
    List<TimeSlot> getByDate(LocalDate date);
}
