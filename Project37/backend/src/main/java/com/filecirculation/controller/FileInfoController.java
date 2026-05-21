package com.filecirculation.controller;

import com.filecirculation.dto.Result;
import com.filecirculation.entity.FileInfo;
import com.filecirculation.service.FileInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileInfoController {
    private final FileInfoService fileInfoService;

    @PostMapping("/upload")
    public Result<FileInfo> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploaderId") Long uploaderId,
            @RequestParam("uploaderName") String uploaderName,
            @RequestParam(value = "description", required = false) String description) throws IOException {
        return Result.success(fileInfoService.uploadFile(file, uploaderId, uploaderName, description));
    }

    @GetMapping("/list")
    public Result<List<FileInfo>> list() {
        return Result.success(fileInfoService.findAll());
    }

    @GetMapping("/uploader/{uploaderId}")
    public Result<List<FileInfo>> listByUploader(@PathVariable Long uploaderId) {
        return Result.success(fileInfoService.findByUploaderId(uploaderId));
    }

    @GetMapping("/{id}")
    public Result<FileInfo> getById(@PathVariable Long id) {
        return fileInfoService.findById(id)
                .map(Result::success)
                .orElse(Result.error("文件不存在"));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws IOException {
        byte[] content = fileInfoService.getFileContent(id);
        if (content == null) {
            return ResponseEntity.notFound().build();
        }

        FileInfo fileInfo = fileInfoService.findById(id).get();
        String fileName = URLEncoder.encode(fileInfo.getFileName(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + fileName)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(content);
    }
}
