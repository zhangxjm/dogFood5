package com.hotel.linen.config;

import com.hotel.linen.entity.CleaningRecord;
import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.entity.LossRecord;
import com.hotel.linen.entity.UsageRecord;
import com.hotel.linen.repository.CleaningRecordRepository;
import com.hotel.linen.repository.LinenInventoryRepository;
import com.hotel.linen.repository.LossRecordRepository;
import com.hotel.linen.repository.UsageRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private LinenInventoryRepository inventoryRepository;

    @Autowired
    private CleaningRecordRepository cleaningRepository;

    @Autowired
    private UsageRecordRepository usageRepository;

    @Autowired
    private LossRecordRepository lossRepository;

    @Override
    public void run(String... args) {
        if (inventoryRepository.count() == 0) {
            initInventory();
        }
        if (cleaningRepository.count() == 0) {
            initCleaningRecords();
        }
        if (usageRepository.count() == 0) {
            initUsageRecords();
        }
        if (lossRepository.count() == 0) {
            initLossRecords();
        }
    }

    private void initInventory() {
        LinenInventory item1 = new LinenInventory();
        item1.setName("白色床单");
        item1.setType("床上用品");
        item1.setTotalQuantity(200);
        item1.setCleanQuantity(150);
        item1.setDirtyQuantity(30);
        item1.setInUseQuantity(20);
        item1.setLocation("一号仓库");
        inventoryRepository.save(item1);

        LinenInventory item2 = new LinenInventory();
        item2.setName("白色被套");
        item2.setType("床上用品");
        item2.setTotalQuantity(200);
        item2.setCleanQuantity(140);
        item2.setDirtyQuantity(35);
        item2.setInUseQuantity(25);
        item2.setLocation("一号仓库");
        inventoryRepository.save(item2);

        LinenInventory item3 = new LinenInventory();
        item3.setName("白色枕套");
        item3.setType("床上用品");
        item3.setTotalQuantity(400);
        item3.setCleanQuantity(300);
        item3.setDirtyQuantity(60);
        item3.setInUseQuantity(40);
        item3.setLocation("一号仓库");
        inventoryRepository.save(item3);

        LinenInventory item4 = new LinenInventory();
        item4.setName("白色浴巾");
        item4.setType("浴室用品");
        item4.setTotalQuantity(300);
        item4.setCleanQuantity(250);
        item4.setDirtyQuantity(30);
        item4.setInUseQuantity(20);
        item4.setLocation("二号仓库");
        inventoryRepository.save(item4);

        LinenInventory item5 = new LinenInventory();
        item5.setName("白色面巾");
        item5.setType("浴室用品");
        item5.setTotalQuantity(500);
        item5.setCleanQuantity(400);
        item5.setDirtyQuantity(60);
        item5.setInUseQuantity(40);
        item5.setLocation("二号仓库");
        inventoryRepository.save(item5);

        LinenInventory item6 = new LinenInventory();
        item6.setName("白色地巾");
        item6.setType("浴室用品");
        item6.setTotalQuantity(150);
        item6.setCleanQuantity(120);
        item6.setDirtyQuantity(20);
        item6.setInUseQuantity(10);
        item6.setLocation("二号仓库");
        inventoryRepository.save(item6);

        LinenInventory item7 = new LinenInventory();
        item7.setName("白色桌布");
        item7.setType("餐厅用品");
        item7.setTotalQuantity(100);
        item7.setCleanQuantity(80);
        item7.setDirtyQuantity(15);
        item7.setInUseQuantity(5);
        item7.setLocation("三号仓库");
        inventoryRepository.save(item7);

        LinenInventory item8 = new LinenInventory();
        item8.setName("白色口布");
        item8.setType("餐厅用品");
        item8.setTotalQuantity(200);
        item8.setCleanQuantity(160);
        item8.setDirtyQuantity(30);
        item8.setInUseQuantity(10);
        item8.setLocation("三号仓库");
        inventoryRepository.save(item8);

        LinenInventory item9 = new LinenInventory();
        item9.setName("员工工服");
        item9.setType("员工用品");
        item9.setTotalQuantity(80);
        item9.setCleanQuantity(60);
        item9.setDirtyQuantity(15);
        item9.setInUseQuantity(5);
        item9.setLocation("四号仓库");
        inventoryRepository.save(item9);

        LinenInventory item10 = new LinenInventory();
        item10.setName("浴袍");
        item10.setType("浴室用品");
        item10.setTotalQuantity(100);
        item10.setCleanQuantity(80);
        item10.setDirtyQuantity(12);
        item10.setInUseQuantity(8);
        item10.setLocation("二号仓库");
        inventoryRepository.save(item10);
    }

    private void initCleaningRecords() {
        CleaningRecord r1 = new CleaningRecord();
        r1.setLinenId(1L);
        r1.setLinenName("白色床单");
        r1.setQuantity(20);
        r1.setCleaner("张师傅");
        r1.setCleanTime(LocalDateTime.now().minusDays(1));
        r1.setStatus("已完成");
        r1.setRemark("常规清洗");
        cleaningRepository.save(r1);

        CleaningRecord r2 = new CleaningRecord();
        r2.setLinenId(4L);
        r2.setLinenName("白色浴巾");
        r2.setQuantity(15);
        r2.setCleaner("李师傅");
        r2.setCleanTime(LocalDateTime.now().minusDays(1));
        r2.setStatus("已完成");
        r2.setRemark("常规清洗");
        cleaningRepository.save(r2);

        CleaningRecord r3 = new CleaningRecord();
        r3.setLinenId(7L);
        r3.setLinenName("白色桌布");
        r3.setQuantity(8);
        r3.setCleaner("王师傅");
        r3.setCleanTime(LocalDateTime.now().minusHours(8));
        r3.setStatus("清洗中");
        r3.setRemark("加急处理");
        cleaningRepository.save(r3);
    }

    private void initUsageRecords() {
        UsageRecord r1 = new UsageRecord();
        r1.setLinenId(1L);
        r1.setLinenName("白色床单");
        r1.setQuantity(10);
        r1.setUserName("客房部-赵主管");
        r1.setDepartment("客房部");
        r1.setUseTime(LocalDateTime.now().minusDays(2));
        r1.setStatus("已领用");
        r1.setRemark("301-305房间更换");
        usageRepository.save(r1);

        UsageRecord r2 = new UsageRecord();
        r2.setLinenId(4L);
        r2.setLinenName("白色浴巾");
        r2.setQuantity(8);
        r2.setUserName("客房部-钱主管");
        r2.setDepartment("客房部");
        r2.setUseTime(LocalDateTime.now().minusDays(1));
        r2.setStatus("已归还");
        r2.setReturnTime(LocalDateTime.now().minusHours(2));
        r2.setRemark("已归还，待清洗");
        usageRepository.save(r2);

        UsageRecord r3 = new UsageRecord();
        r3.setLinenId(7L);
        r3.setLinenName("白色桌布");
        r3.setQuantity(5);
        r3.setUserName("餐饮部-孙经理");
        r3.setDepartment("餐饮部");
        r3.setUseTime(LocalDateTime.now().minusHours(6));
        r3.setStatus("已领用");
        r3.setRemark("宴会厅使用");
        usageRepository.save(r3);
    }

    private void initLossRecords() {
        LossRecord r1 = new LossRecord();
        r1.setLinenId(5L);
        r1.setLinenName("白色面巾");
        r1.setQuantity(10);
        r1.setReason("正常损耗-使用年限到期");
        r1.setLossTime(LocalDateTime.now().minusDays(3));
        r1.setRecorder("库房-周主管");
        r1.setRemark("做报废处理");
        lossRepository.save(r1);

        LossRecord r2 = new LossRecord();
        r2.setLinenId(1L);
        r2.setLinenName("白色床单");
        r2.setQuantity(3);
        r2.setReason("客人损坏");
        r2.setLossTime(LocalDateTime.now().minusDays(1));
        r2.setRecorder("客房部-吴主管");
        r2.setRemark("已向客人索赔");
        lossRepository.save(r2);

        LossRecord r3 = new LossRecord();
        r3.setLinenId(9L);
        r3.setLinenName("员工工服");
        r3.setQuantity(2);
        r3.setReason("员工离职未归还");
        r3.setLossTime(LocalDateTime.now().minusHours(10));
        r3.setRecorder("人事部-郑主管");
        r3.setRemark("从工资中扣除");
        lossRepository.save(r3);
    }
}
