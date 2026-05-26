package com.jushas.manager.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jushas.manager.entity.SessionRecord;
import com.jushas.manager.mapper.SessionRecordMapper;
import com.jushas.manager.service.SessionRecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class SessionRecordServiceImpl extends ServiceImpl<SessionRecordMapper, SessionRecord> implements SessionRecordService {

    @Override
    public List<SessionRecord> getAllSessions() {
        return list();
    }

    @Override
    public SessionRecord getSessionById(Long id) {
        return getById(id);
    }

    @Override
    public List<SessionRecord> getSessionsByScript(Long scriptId) {
        LambdaQueryWrapper<SessionRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SessionRecord::getScriptId, scriptId);
        return list(wrapper);
    }

    @Override
    public boolean addSession(SessionRecord sessionRecord) {
        sessionRecord.setCreateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        if (sessionRecord.getStatus() == null) {
            sessionRecord.setStatus(0);
        }
        return save(sessionRecord);
    }

    @Override
    public boolean updateSession(SessionRecord sessionRecord) {
        return updateById(sessionRecord);
    }

    @Override
    public boolean deleteSession(Long id) {
        return removeById(id);
    }
}
