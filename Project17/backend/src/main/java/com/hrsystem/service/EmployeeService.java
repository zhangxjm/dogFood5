package com.hrsystem.service;

import com.hrsystem.entity.Employee;
import com.hrsystem.entity.EmploymentRecord;
import com.hrsystem.entity.PositionChange;
import com.hrsystem.repository.EmployeeRepository;
import com.hrsystem.repository.EmploymentRecordRepository;
import com.hrsystem.repository.PositionChangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmploymentRecordRepository employmentRecordRepository;

    @Autowired
    private PositionChangeRepository positionChangeRepository;

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> findById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee findByEmployeeNo(String employeeNo) {
        return employeeRepository.findByEmployeeNo(employeeNo);
    }

    public Employee save(Employee employee) {
        return employeeRepository.save(employee);
    }

    public void deleteById(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<Employee> searchByKeyword(String keyword) {
        return employeeRepository.searchByKeyword(keyword);
    }

    public List<Employee> findByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    public List<Employee> findByStatus(String status) {
        return employeeRepository.findByStatus(status);
    }

    public EmploymentRecord addEmploymentRecord(Long employeeId, EmploymentRecord record) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("员工不存在"));
        record.setEmployee(employee);
        return employmentRecordRepository.save(record);
    }

    public List<EmploymentRecord> getEmploymentRecords(Long employeeId) {
        return employmentRecordRepository.findByEmployeeIdOrderByRecordDateDesc(employeeId);
    }

    public PositionChange addPositionChange(Long employeeId, PositionChange change) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("员工不存在"));
        change.setEmployee(employee);
        
        employee.setDepartment(change.getNewDepartment());
        employee.setPosition(change.getNewPosition());
        employeeRepository.save(employee);
        
        return positionChangeRepository.save(change);
    }

    public List<PositionChange> getPositionChanges(Long employeeId) {
        return positionChangeRepository.findByEmployeeIdOrderByChangeDateDesc(employeeId);
    }
}
