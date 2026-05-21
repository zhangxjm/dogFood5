package com.hrsystem.repository;

import com.hrsystem.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Employee findByEmployeeNo(String employeeNo);

    @Query("SELECT e FROM Employee e WHERE " +
           "e.name LIKE %:keyword% OR " +
           "e.employeeNo LIKE %:keyword% OR " +
           "e.phone LIKE %:keyword% OR " +
           "e.department LIKE %:keyword% OR " +
           "e.position LIKE %:keyword%")
    List<Employee> searchByKeyword(@Param("keyword") String keyword);

    List<Employee> findByDepartment(String department);

    List<Employee> findByStatus(String status);
}
