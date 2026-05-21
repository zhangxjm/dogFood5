package com.filecirculation.service;

import com.filecirculation.entity.FileInfo;
import com.filecirculation.repository.FileInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileInfoService {
    private final FileInfoRepository fileInfoRepository;
    private final String uploadDir = "uploads";

    public FileInfo uploadFile(MultipartFile file, Long uploaderId, String uploaderName, String description) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + fileExtension;
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String dateDir = uploadDir + "/" + timestamp;
        Files.createDirectories(Paths.get(dateDir));

        String filePath = dateDir + "/" + newFilename;
        file.transferTo(new File(filePath));

        FileInfo fileInfo = new FileInfo();
        fileInfo.setFileName(originalFilename);
        fileInfo.setFileType(file.getContentType());
        fileInfo.setFileSize(file.getSize());
        fileInfo.setFilePath(filePath);
        fileInfo.setUploaderId(uploaderId);
        fileInfo.setUploaderName(uploaderName);
        fileInfo.setDescription(description);

        return fileInfoRepository.save(fileInfo);
    }

    public Optional<FileInfo> findById(Long id) {
        return fileInfoRepository.findById(id);
    }

    public List<FileInfo> findByUploaderId(Long uploaderId) {
        return fileInfoRepository.findByUploaderId(uploaderId);
    }

    public List<FileInfo> findAll() {
        return fileInfoRepository.findAll();
    }

    public byte[] getFileContent(Long fileId) throws IOException {
        Optional<FileInfo> fileInfoOpt = fileInfoRepository.findById(fileId);
        if (fileInfoOpt.isPresent()) {
            Path path = Paths.get(fileInfoOpt.get().getFilePath());
            return Files.readAllBytes(path);
        }
        return null;
    }
}
