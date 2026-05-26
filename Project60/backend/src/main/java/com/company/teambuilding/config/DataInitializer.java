package com.company.teambuilding.config;

import com.company.teambuilding.entity.Expense;
import com.company.teambuilding.entity.Participant;
import com.company.teambuilding.entity.ReviewRecord;
import com.company.teambuilding.entity.TeamBuildingPlan;
import com.company.teambuilding.repository.ExpenseRepository;
import com.company.teambuilding.repository.ParticipantRepository;
import com.company.teambuilding.repository.ReviewRecordRepository;
import com.company.teambuilding.repository.TeamBuildingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TeamBuildingPlanRepository planRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ReviewRecordRepository reviewRecordRepository;

    @Override
    public void run(String... args) {
        if (planRepository.count() == 0) {
            initSampleData();
        }
    }

    private void initSampleData() {
        TeamBuildingPlan plan1 = new TeamBuildingPlan();
        plan1.setTitle("2024年春季户外拓展活动");
        plan1.setDescription("组织全体员工进行户外拓展训练，增强团队凝聚力");
        plan1.setLocation("青山湖拓展基地");
        plan1.setStartDate(LocalDate.of(2024, 4, 15));
        plan1.setEndDate(LocalDate.of(2024, 4, 16));
        plan1.setBudget(new BigDecimal("20000.00"));
        plan1.setStatus("COMPLETED");
        plan1.setOrganizer("人力资源部");
        plan1 = planRepository.save(plan1);

        TeamBuildingPlan plan2 = new TeamBuildingPlan();
        plan2.setTitle("技术部门季度团建");
        plan2.setDescription("技术部门团建活动，包含聚餐和娱乐活动");
        plan2.setLocation("市区某度假村");
        plan2.setStartDate(LocalDate.of(2024, 5, 20));
        plan2.setEndDate(LocalDate.of(2024, 5, 21));
        plan2.setBudget(new BigDecimal("15000.00"));
        plan2.setStatus("IN_PROGRESS");
        plan2.setOrganizer("技术部");
        plan2 = planRepository.save(plan2);

        TeamBuildingPlan plan3 = new TeamBuildingPlan();
        plan3.setTitle("新员工入职团建");
        plan3.setDescription("欢迎新员工加入，促进新老员工交流");
        plan3.setLocation("公司会议室及周边餐厅");
        plan3.setStartDate(LocalDate.of(2024, 6, 1));
        plan3.setEndDate(LocalDate.of(2024, 6, 1));
        plan3.setBudget(new BigDecimal("5000.00"));
        plan3.setStatus("DRAFT");
        plan3.setOrganizer("人力资源部");
        planRepository.save(plan3);

        addParticipants(plan1.getId());
        addExpenses(plan1.getId());
        addReview(plan1.getId());
    }

    private void addParticipants(Long planId) {
        String[] names = {"张三", "李四", "王五", "赵六", "钱七"};
        String[] departments = {"技术部", "市场部", "财务部", "人力资源部", "产品部"};
        
        for (int i = 0; i < names.length; i++) {
            Participant p = new Participant();
            p.setPlanId(planId);
            p.setName(names[i]);
            p.setDepartment(departments[i]);
            p.setPhone("1380000" + String.format("%04d", i + 1));
            p.setEmail(names[i] + "@company.com");
            p.setStatus("CONFIRMED");
            participantRepository.save(p);
        }
    }

    private void addExpenses(Long planId) {
        Expense e1 = new Expense();
        e1.setPlanId(planId);
        e1.setItemName("场地租赁");
        e1.setAmount(new BigDecimal("5000.00"));
        e1.setCategory("场地");
        e1.setExpenseDate(LocalDate.of(2024, 4, 15));
        e1.setRemark("拓展基地场地费用");
        expenseRepository.save(e1);

        Expense e2 = new Expense();
        e2.setPlanId(planId);
        e2.setItemName("餐饮费用");
        e2.setAmount(new BigDecimal("6000.00"));
        e2.setCategory("餐饮");
        e2.setExpenseDate(LocalDate.of(2024, 4, 15));
        e2.setRemark("两正餐一早餐");
        expenseRepository.save(e2);

        Expense e3 = new Expense();
        e3.setPlanId(planId);
        e3.setItemName("交通费用");
        e3.setAmount(new BigDecimal("3000.00"));
        e3.setCategory("交通");
        e3.setExpenseDate(LocalDate.of(2024, 4, 15));
        e3.setRemark("大巴车租赁");
        expenseRepository.save(e3);
    }

    private void addReview(Long planId) {
        ReviewRecord r = new ReviewRecord();
        r.setPlanId(planId);
        r.setHighlights("团队协作项目效果很好，大家参与度很高");
        r.setImprovements("时间安排可以更合理，餐饮可以更丰富");
        r.setFeedback("整体活动很成功，期待下次活动");
        r.setSatisfactionScore(90);
        r.setRecorder("人力资源部");
        reviewRecordRepository.save(r);
    }
}
