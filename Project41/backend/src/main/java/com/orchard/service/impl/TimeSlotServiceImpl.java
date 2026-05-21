package com.orchard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.orchard.entity.TimeSlot;
import com.orchard.mapper.TimeSlotMapper;
import com.orchard.service.TimeSlotService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TimeSlotServiceImpl extends ServiceImpl<TimeSlotMapper, TimeSlot> implements TimeSlotService {
    @Override
    public List<TimeSlot> getByDate(LocalDate date) {
        LambdaQueryWrapper<TimeSlot> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TimeSlot::getDate, date)
                .eq(TimeSlot::getStatus, 1)
                .orderByAsc(TimeSlot::getStartTime);
        return list(wrapper);
    }
}
