package com.jushas.manager.controller;

import com.jushas.manager.common.Result;
import com.jushas.manager.entity.SessionRecord;
import com.jushas.manager.service.SessionRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-record")
@CrossOrigin
public class SessionRecordController {

    @Autowired
    private SessionRecordService sessionRecordService;

    @GetMapping("/list")
    public Result<List<SessionRecord>> list() {
        return Result.success(sessionRecordService.getAllSessions());
    }

    @GetMapping("/{id}")
    public Result<SessionRecord> getById(@PathVariable Long id) {
        return Result.success(sessionRecordService.getSessionById(id));
    }

    @GetMapping("/script/{scriptId}")
    public Result<List<SessionRecord>> getByScript(@PathVariable Long scriptId) {
        return Result.success(sessionRecordService.getSessionsByScript(scriptId));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody SessionRecord sessionRecord) {
        return Result.success(sessionRecordService.addSession(sessionRecord));
    }

    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody SessionRecord sessionRecord) {
        return Result.success(sessionRecordService.updateSession(sessionRecord));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(sessionRecordService.deleteSession(id));
    }
}
