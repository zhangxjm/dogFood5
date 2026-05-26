package com.afternoontea.service;

import com.afternoontea.entity.Department;
import com.afternoontea.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department create(Department department) {
        return departmentRepository.save(department);
    }

    public Department update(Long id, Department department) {
        Optional<Department> existing = departmentRepository.findById(id);
        if (existing.isPresent()) {
            Department d = existing.get();
            d.setName(department.getName());
            d.setManager(department.getManager());
            return departmentRepository.save(d);
        }
        return null;
    }

    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Department> findById(Long id) {
        return departmentRepository.findById(id);
    }
}
