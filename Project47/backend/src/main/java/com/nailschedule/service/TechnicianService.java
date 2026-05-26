package com.nailschedule.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nailschedule.entity.Technician;
import com.nailschedule.mapper.TechnicianMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TechnicianService {

    @Autowired
    private TechnicianMapper technicianMapper;

    public List<Technician> list() {
        return technicianMapper.selectList(
                new LambdaQueryWrapper<Technician>().orderByDesc(Technician::getCreateTime));
    }

    public Technician getById(Long id) {
        return technicianMapper.selectById(id);
    }

    public Technician save(Technician technician) {
        if (technician.getId() == null) {
            technicianMapper.insert(technician);
        } else {
            technicianMapper.updateById(technician);
        }
        return technician;
    }

    public void delete(Long id) {
        technicianMapper.deleteById(id);
    }

    public List<Technician> listActive() {
        return technicianMapper.selectList(
                new LambdaQueryWrapper<Technician>().eq(Technician::getStatus, 1));
    }
}
