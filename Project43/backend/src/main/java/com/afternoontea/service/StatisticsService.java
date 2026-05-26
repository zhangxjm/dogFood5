package com.afternoontea.service;

import com.afternoontea.dto.CategoryStatsDTO;
import com.afternoontea.dto.DepartmentStatsDTO;
import com.afternoontea.entity.Application;
import com.afternoontea.entity.ApplicationItem;
import com.afternoontea.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatisticsService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<DepartmentStatsDTO> getDepartmentStats(LocalDateTime startTime, LocalDateTime endTime) {
        List<Application> applications;
        if (startTime != null && endTime != null) {
            applications = applicationRepository.findByApplyTimeBetween(startTime, endTime);
        } else {
            applications = applicationRepository.findAll();
        }

        Map<Long, DepartmentStatsDTO> statsMap = new HashMap<>();

        for (Application app : applications) {
            if (app.getDepartment() == null) continue;

            Long deptId = app.getDepartment().getId();
            DepartmentStatsDTO stats = statsMap.computeIfAbsent(deptId, k -> {
                DepartmentStatsDTO dto = new DepartmentStatsDTO();
                dto.setDepartmentId(deptId);
                dto.setDepartmentName(app.getDepartment().getName());
                dto.setApplicationCount(0L);
                dto.setTotalQuantity(0L);
                dto.setTotalAmount(0.0);
                return dto;
            });

            stats.setApplicationCount(stats.getApplicationCount() + 1);

            for (ApplicationItem item : app.getItems()) {
                stats.setTotalQuantity(stats.getTotalQuantity() + item.getQuantity());
                if (item.getCategory() != null && item.getCategory().getPrice() != null) {
                    stats.setTotalAmount(stats.getTotalAmount() + item.getQuantity() * item.getCategory().getPrice());
                }
            }
        }

        return new ArrayList<>(statsMap.values());
    }

    public List<CategoryStatsDTO> getCategoryStats(LocalDateTime startTime, LocalDateTime endTime) {
        List<Application> applications;
        if (startTime != null && endTime != null) {
            applications = applicationRepository.findByApplyTimeBetween(startTime, endTime);
        } else {
            applications = applicationRepository.findAll();
        }

        Map<Long, CategoryStatsDTO> statsMap = new HashMap<>();

        for (Application app : applications) {
            for (ApplicationItem item : app.getItems()) {
                if (item.getCategory() == null) continue;

                Long catId = item.getCategory().getId();
                CategoryStatsDTO stats = statsMap.computeIfAbsent(catId, k -> {
                    CategoryStatsDTO dto = new CategoryStatsDTO();
                    dto.setCategoryId(catId);
                    dto.setCategoryName(item.getCategory().getName());
                    dto.setTotalQuantity(0L);
                    dto.setTotalAmount(0.0);
                    return dto;
                });

                stats.setTotalQuantity(stats.getTotalQuantity() + item.getQuantity());
                if (item.getCategory().getPrice() != null) {
                    stats.setTotalAmount(stats.getTotalAmount() + item.getQuantity() * item.getCategory().getPrice());
                }
            }
        }

        return new ArrayList<>(statsMap.values());
    }

    public Map<String, Object> getOverallStats() {
        List<Application> applications = applicationRepository.findAll();

        Map<String, Object> result = new HashMap<>();
        result.put("totalApplications", (long) applications.size());
        result.put("totalQuantity", applications.stream()
                .flatMap(app -> app.getItems().stream())
                .mapToLong(ApplicationItem::getQuantity)
                .sum());
        result.put("totalAmount", applications.stream()
                .flatMap(app -> app.getItems().stream())
                .mapToDouble(item -> {
                    if (item.getCategory() != null && item.getCategory().getPrice() != null) {
                        return item.getQuantity() * item.getCategory().getPrice();
                    }
                    return 0.0;
                })
                .sum());

        return result;
    }
}
