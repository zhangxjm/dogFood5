package com.jushas.manager.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jushas.manager.entity.PlayerRecord;
import com.jushas.manager.mapper.PlayerRecordMapper;
import com.jushas.manager.service.PlayerRecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PlayerRecordServiceImpl extends ServiceImpl<PlayerRecordMapper, PlayerRecord> implements PlayerRecordService {

    @Override
    public List<PlayerRecord> getAllPlayerRecords() {
        return list();
    }

    @Override
    public PlayerRecord getPlayerRecordById(Long id) {
        return getById(id);
    }

    @Override
    public List<PlayerRecord> getPlayerRecordsBySession(Long sessionId) {
        LambdaQueryWrapper<PlayerRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PlayerRecord::getSessionId, sessionId);
        return list(wrapper);
    }

    @Override
    public boolean addPlayerRecord(PlayerRecord playerRecord) {
        playerRecord.setCreateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return save(playerRecord);
    }

    @Override
    public boolean updatePlayerRecord(PlayerRecord playerRecord) {
        return updateById(playerRecord);
    }

    @Override
    public boolean deletePlayerRecord(Long id) {
        return removeById(id);
    }
}
