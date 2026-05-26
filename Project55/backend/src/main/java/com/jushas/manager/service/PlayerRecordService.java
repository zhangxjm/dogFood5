package com.jushas.manager.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jushas.manager.entity.PlayerRecord;

import java.util.List;

public interface PlayerRecordService extends IService<PlayerRecord> {
    List<PlayerRecord> getAllPlayerRecords();
    PlayerRecord getPlayerRecordById(Long id);
    List<PlayerRecord> getPlayerRecordsBySession(Long sessionId);
    boolean addPlayerRecord(PlayerRecord playerRecord);
    boolean updatePlayerRecord(PlayerRecord playerRecord);
    boolean deletePlayerRecord(Long id);
}
