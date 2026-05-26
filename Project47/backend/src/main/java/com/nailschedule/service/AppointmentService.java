package com.nailschedule.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nailschedule.entity.Appointment;
import com.nailschedule.mapper.AppointmentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentMapper appointmentMapper;

    public List<Map<String, Object>> findByDate(LocalDate date) {
        return appointmentMapper.findByDate(date);
    }

    public List<Map<String, Object>> findByTechnicianAndDateRange(Long technicianId,
                                                                   LocalDate startDate,
                                                                   LocalDate endDate) {
        return appointmentMapper.findByTechnicianAndDateRange(technicianId, startDate, endDate);
    }

    public Appointment save(Appointment appointment) {
        if (appointment.getId() == null) {
            if (appointment.getStatus() == null) {
                appointment.setStatus(1);
            }
            appointmentMapper.insert(appointment);
        } else {
            appointmentMapper.updateById(appointment);
        }
        return appointment;
    }

    public void delete(Long id) {
        appointmentMapper.deleteById(id);
    }

    public void updateStatus(Long id, Integer status) {
        Appointment appointment = appointmentMapper.selectById(id);
        if (appointment != null) {
            appointment.setStatus(status);
            appointmentMapper.updateById(appointment);
        }
    }

    public List<Appointment> findAll() {
        return appointmentMapper.selectList(
                new LambdaQueryWrapper<Appointment>().orderByDesc(Appointment::getCreateTime));
    }
}
