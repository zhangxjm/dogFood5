package com.nailschedule.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nailschedule.entity.Schedule;
import com.nailschedule.mapper.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleMapper scheduleMapper;

    public List<Map<String, Object>> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return scheduleMapper.findByDateRange(startDate, endDate);
    }

    public List<Schedule> findByTechnicianAndDate(Long technicianId, LocalDate date) {
        return scheduleMapper.selectList(
                new LambdaQueryWrapper<Schedule>()
                        .eq(Schedule::getTechnicianId, technicianId)
                        .eq(Schedule::getScheduleDate, date));
    }

    public Schedule save(Schedule schedule) {
        if (schedule.getId() == null) {
            scheduleMapper.insert(schedule);
        } else {
            scheduleMapper.updateById(schedule);
        }
        return schedule;
    }

    public void delete(Long id) {
        scheduleMapper.deleteById(id);
    }

    public void batchSave(List<Schedule> schedules) {
        for (Schedule schedule : schedules) {
            if (schedule.getId() == null) {
                scheduleMapper.insert(schedule);
            } else {
                scheduleMapper.updateById(schedule);
            }
        }
    }
}
