package com.jushas.manager.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jushas.manager.entity.SessionRecord;

import java.util.List;

public interface SessionRecordService extends IService<SessionRecord> {
    List<SessionRecord> getAllSessions();
    SessionRecord getSessionById(Long id);
    List<SessionRecord> getSessionsByScript(Long scriptId);
    boolean addSession(SessionRecord sessionRecord);
    boolean updateSession(SessionRecord sessionRecord);
    boolean deleteSession(Long id);
}
