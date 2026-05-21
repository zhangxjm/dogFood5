package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.Department;
import com.stationery.mapper.DepartmentMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepartmentService extends ServiceImpl<DepartmentMapper, Department> {

    public List<Department> listAll() {
        return list(new LambdaQueryWrapper<Department>()
                .eq(Department::getStatus, 1)
                .orderByAsc(Department::getSortOrder));
    }

    public boolean saveDept(Department department) {
        department.setCreateTime(LocalDateTime.now());
        department.setUpdateTime(LocalDateTime.now());
        department.setStatus(1);
        department.setDeleted(0);
        return save(department);
    }

    public boolean updateDept(Department department) {
        department.setUpdateTime(LocalDateTime.now());
        return updateById(department);
    }

    public boolean deleteDept(Long id) {
        return removeById(id);
    }
}
