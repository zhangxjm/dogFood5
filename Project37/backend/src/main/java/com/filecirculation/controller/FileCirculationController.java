package com.filecirculation.controller;

import com.filecirculation.dto.CirculateRequest;
import com.filecirculation.dto.Result;
import com.filecirculation.entity.FileCirculation;
import com.filecirculation.service.FileCirculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circulation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileCirculationController {
    private final FileCirculationService circulationService;

    @PostMapping("/circulate")
    public Result<List<FileCirculation>> circulate(@RequestBody CirculateRequest request) {
        return Result.success(circulationService.circulateFile(request));
    }

    @GetMapping("/file/{fileId}")
    public Result<List<FileCirculation>> getByFileId(@PathVariable Long fileId) {
        return Result.success(circulationService.findByFileId(fileId));
    }

    @GetMapping("/receiver/{receiverId}")
    public Result<List<FileCirculation>> getByReceiverId(@PathVariable Long receiverId) {
        return Result.success(circulationService.findByReceiverId(receiverId));
    }

    @GetMapping("/circulator/{circulatorId}")
    public Result<List<FileCirculation>> getByCirculatorId(@PathVariable Long circulatorId) {
        return Result.success(circulationService.findByCirculatorId(circulatorId));
    }

    @PutMapping("/read/{id}")
    public Result<FileCirculation> markAsRead(@PathVariable Long id) {
        FileCirculation circulation = circulationService.markAsRead(id);
        if (circulation != null) {
            return Result.success(circulation);
        }
        return Result.error("传阅记录不存在");
    }
}
