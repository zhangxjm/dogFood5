package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.ClaimRecord;
import com.stationery.mapper.ClaimRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ClaimRecordService extends ServiceImpl<ClaimRecordMapper, ClaimRecord> {

    @Autowired
    private PurchaseItemService itemService;

    public List<ClaimRecord> listAll() {
        return list(new LambdaQueryWrapper<ClaimRecord>()
                .orderByDesc(ClaimRecord::getCreateTime));
    }

    public List<ClaimRecord> listByDept(Long deptId) {
        return list(new LambdaQueryWrapper<ClaimRecord>()
                .eq(ClaimRecord::getDeptId, deptId)
                .orderByDesc(ClaimRecord::getCreateTime));
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveClaim(ClaimRecord record) {
        record.setClaimDate(LocalDateTime.now());
        record.setCreateTime(LocalDateTime.now());
        record.setUpdateTime(LocalDateTime.now());
        record.setDeleted(0);
        
        if (save(record)) {
            itemService.updateStock(record.getItemId(), -record.getQuantity());
            return true;
        }
        return false;
    }

    public List<Map<String, Object>> getDeptClaimStatistics() {
        List<ClaimRecord> records = listAll();
        return records.stream()
                .collect(Collectors.groupingBy(
                        ClaimRecord::getDeptId,
                        Collectors.summingInt(ClaimRecord::getQuantity)
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("deptId", entry.getKey());
                    map.put("totalQuantity", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }
}
