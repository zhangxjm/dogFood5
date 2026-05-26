package com.afternoontea.service;

import com.afternoontea.entity.Application;
import com.afternoontea.entity.ApplicationItem;
import com.afternoontea.entity.Category;
import com.afternoontea.entity.Inventory;
import com.afternoontea.repository.ApplicationRepository;
import com.afternoontea.repository.CategoryRepository;
import com.afternoontea.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Application create(Application application) {
        application.setStatus("AUTO_APPROVED");
        application.setApproveTime(LocalDateTime.now());

        for (ApplicationItem item : application.getItems()) {
            item.setApplication(application);
            if (item.getCategory() != null && item.getCategory().getId() != null) {
                Optional<Category> categoryOpt = categoryRepository.findById(item.getCategory().getId());
                if (categoryOpt.isPresent()) {
                    Category category = categoryOpt.get();
                    int newStock = category.getStock() - item.getQuantity();
                    if (newStock < 0) {
                        throw new RuntimeException("Insufficient stock for: " + category.getName());
                    }
                    category.setStock(newStock);
                    categoryRepository.save(category);

                    Inventory inventory = new Inventory();
                    inventory.setCategory(category);
                    inventory.setChangeQuantity(-item.getQuantity());
                    inventory.setChangeType("APPLY");
                    inventory.setRemark("Auto approved application");
                    inventoryRepository.save(inventory);
                }
            }
        }

        return applicationRepository.save(application);
    }

    public void delete(Long id) {
        applicationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Application> findById(Long id) {
        return applicationRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Application> findByDepartmentId(Long departmentId) {
        return applicationRepository.findByDepartmentId(departmentId);
    }

    @Transactional(readOnly = true)
    public List<Application> findByEmployeeId(Long employeeId) {
        return applicationRepository.findByEmployeeId(employeeId);
    }

    @Transactional(readOnly = true)
    public List<Application> findByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Application> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return applicationRepository.findByApplyTimeBetween(startTime, endTime);
    }

    @Transactional(readOnly = true)
    public List<Application> findByDepartmentAndTimeRange(Long departmentId, LocalDateTime startTime, LocalDateTime endTime) {
        return applicationRepository.findByDepartmentIdAndApplyTimeBetween(departmentId, startTime, endTime);
    }
}
