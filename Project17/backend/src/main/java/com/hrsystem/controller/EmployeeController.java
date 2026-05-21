package com.hrsystem.controller;

import com.hrsystem.entity.Employee;
import com.hrsystem.entity.EmploymentRecord;
import com.hrsystem.entity.PositionChange;
import com.hrsystem.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.findAll();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.findById(id);
        return employee.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/no/{employeeNo}")
    public ResponseEntity<Employee> getEmployeeByNo(@PathVariable String employeeNo) {
        Employee employee = employeeService.findByEmployeeNo(employeeNo);
        return employee != null ? ResponseEntity.ok(employee) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
        try {
            Employee savedEmployee = employeeService.save(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        return employeeService.findById(id)
                .map(existingEmployee -> {
                    employee.setId(id);
                    Employee updatedEmployee = employeeService.save(employee);
                    return ResponseEntity.ok(updatedEmployee);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        return employeeService.findById(id)
                .map(employee -> {
                    employeeService.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String keyword) {
        List<Employee> employees = employeeService.searchByKeyword(keyword);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.findByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Employee>> getEmployeesByStatus(@PathVariable String status) {
        List<Employee> employees = employeeService.findByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @PostMapping("/{employeeId}/employment-records")
    public ResponseEntity<?> addEmploymentRecord(
            @PathVariable Long employeeId,
            @RequestBody EmploymentRecord record) {
        try {
            EmploymentRecord savedRecord = employeeService.addEmploymentRecord(employeeId, record);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{employeeId}/employment-records")
    public ResponseEntity<List<EmploymentRecord>> getEmploymentRecords(@PathVariable Long employeeId) {
        List<EmploymentRecord> records = employeeService.getEmploymentRecords(employeeId);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/{employeeId}/position-changes")
    public ResponseEntity<?> addPositionChange(
            @PathVariable Long employeeId,
            @RequestBody PositionChange change) {
        try {
            PositionChange savedChange = employeeService.addPositionChange(employeeId, change);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedChange);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{employeeId}/position-changes")
    public ResponseEntity<List<PositionChange>> getPositionChanges(@PathVariable Long employeeId) {
        List<PositionChange> changes = employeeService.getPositionChanges(employeeId);
        return ResponseEntity.ok(changes);
    }
}
