package com.jushas.manager.controller;

import com.jushas.manager.common.Result;
import com.jushas.manager.entity.PlayerRecord;
import com.jushas.manager.service.PlayerRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player-record")
@CrossOrigin
public class PlayerRecordController {

    @Autowired
    private PlayerRecordService playerRecordService;

    @GetMapping("/list")
    public Result<List<PlayerRecord>> list() {
        return Result.success(playerRecordService.getAllPlayerRecords());
    }

    @GetMapping("/{id}")
    public Result<PlayerRecord> getById(@PathVariable Long id) {
        return Result.success(playerRecordService.getPlayerRecordById(id));
    }

    @GetMapping("/session/{sessionId}")
    public Result<List<PlayerRecord>> getBySession(@PathVariable Long sessionId) {
        return Result.success(playerRecordService.getPlayerRecordsBySession(sessionId));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody PlayerRecord playerRecord) {
        return Result.success(playerRecordService.addPlayerRecord(playerRecord));
    }

    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody PlayerRecord playerRecord) {
        return Result.success(playerRecordService.updatePlayerRecord(playerRecord));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(playerRecordService.deletePlayerRecord(id));
    }
}
