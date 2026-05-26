package com.afternoontea.config;

import com.afternoontea.entity.Category;
import com.afternoontea.entity.Department;
import com.afternoontea.entity.Employee;
import com.afternoontea.entity.Inventory;
import com.afternoontea.repository.CategoryRepository;
import com.afternoontea.repository.DepartmentRepository;
import com.afternoontea.repository.EmployeeRepository;
import com.afternoontea.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            initDepartments();
        }
        if (employeeRepository.count() == 0) {
            initEmployees();
        }
        if (categoryRepository.count() == 0) {
            initCategories();
        }
    }

    private void initDepartments() {
        String[] deptNames = {"Tech Department", "Product Department", "Marketing Department", "HR Department", "Finance Department"};
        String[] managers = {"Zhang San", "Li Si", "Wang Wu", "Zhao Liu", "Sun Qi"};

        for (int i = 0; i < deptNames.length; i++) {
            Department dept = new Department();
            dept.setName(deptNames[i]);
            dept.setManager(managers[i]);
            dept.setCreateTime(LocalDateTime.now());
            departmentRepository.save(dept);
        }
    }

    private void initEmployees() {
        String[][] employees = {
                {"Chen Gong", "chengong@company.com", "1"},
                {"Liu Cheng", "liucheng@company.com", "1"},
                {"Wang Jia", "wangjia@company.com", "2"},
                {"Zhou Min", "zhoumin@company.com", "2"},
                {"Wu Yan", "wuyan@company.com", "3"},
                {"Zheng Li", "zhengli@company.com", "3"},
                {"Feng Hua", "fenghua@company.com", "4"},
                {"Zhu Qiang", "zhuqiang@company.com", "5"}
        };

        for (String[] emp : employees) {
            Employee employee = new Employee();
            employee.setName(emp[0]);
            employee.setEmail(emp[1]);
            departmentRepository.findById(Long.parseLong(emp[2])).ifPresent(employee::setDepartment);
            employee.setCreateTime(LocalDateTime.now());
            employeeRepository.save(employee);
        }
    }

    private void initCategories() {
        String[][] categories = {
                {"Coffee", "Drinks", "Freshly ground coffee", "100", "15.0"},
                {"Milk Tea", "Drinks", "Pearl milk tea", "80", "18.0"},
                {"Green Tea", "Drinks", "Premium green tea", "60", "12.0"},
                {"Fruit Juice", "Drinks", "Fresh juice", "50", "20.0"},
                {"Mineral Water", "Drinks", "Premium mineral water", "200", "5.0"},
                {"Cake", "Desserts", "Fresh cream cake", "40", "25.0"},
                {"Bread", "Desserts", "Soft bread", "60", "8.0"},
                {"Cookies", "Desserts", "Handmade cookies", "100", "6.0"},
                {"Fruit Platter", "Fruits", "Seasonal fruits", "30", "30.0"},
                {"Yogurt", "Dairy", "Probiotic yogurt", "50", "10.0"}
        };

        for (String[] cat : categories) {
            Category category = new Category();
            category.setName(cat[0]);
            category.setType(cat[1]);
            category.setDescription(cat[2]);
            category.setStock(Integer.parseInt(cat[3]));
            category.setPrice(Double.parseDouble(cat[4]));
            category.setCreateTime(LocalDateTime.now());
            category.setUpdateTime(LocalDateTime.now());
            categoryRepository.save(category);

            Inventory inventory = new Inventory();
            inventory.setCategory(category);
            inventory.setChangeQuantity(Integer.parseInt(cat[3]));
            inventory.setChangeType("INIT");
            inventory.setRecordTime(LocalDateTime.now());
            inventory.setRemark("Initial stock");
            inventoryRepository.save(inventory);
        }
    }
}
