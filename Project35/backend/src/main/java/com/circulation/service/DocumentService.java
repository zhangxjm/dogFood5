package com.circulation.service;

import com.circulation.dto.CirculationDTO;
import com.circulation.dto.DocumentDTO;
import com.circulation.entity.Circulation;
import com.circulation.entity.Document;
import com.circulation.entity.User;
import com.circulation.repository.CirculationRepository;
import com.circulation.repository.DocumentRepository;
import com.circulation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CirculationRepository circulationRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.path:./uploads}")
    private String uploadPath;

    @Transactional
    public DocumentDTO uploadDocument(MultipartFile file, Long uploaderId, String description, List<Long> readerIds) throws IOException {
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadDir.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Document document = Document.builder()
                .fileName(originalFilename)
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .fileType(getFileExtension(originalFilename))
                .uploaderId(uploaderId)
                .description(description)
                .build();

        document = documentRepository.save(document);

        if (readerIds != null && !readerIds.isEmpty()) {
            for (Long readerId : readerIds) {
                if (!circulationRepository.existsByDocumentIdAndReaderId(document.getId(), readerId)) {
                    Circulation circulation = Circulation.builder()
                            .documentId(document.getId())
                            .readerId(readerId)
                            .status(Circulation.ReadStatus.PENDING)
                            .build();
                    circulationRepository.save(circulation);
                }
            }
        }

        return convertToDTO(document);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    public List<DocumentDTO> getAllDocuments() {
        List<Document> documents = documentRepository.findAllOrderByCreatedAtDesc();
        return documents.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<DocumentDTO> getDocumentsByUploader(Long uploaderId) {
        List<Document> documents = documentRepository.findByUploaderIdOrderByCreatedAtDesc(uploaderId);
        return documents.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id).orElse(null);
        if (document == null) {
            return null;
        }
        return convertToDTO(document);
    }

    @Transactional
    public DocumentDTO addReaders(Long documentId, List<Long> readerIds) {
        Document document = documentRepository.findById(documentId).orElse(null);
        if (document == null) {
            return null;
        }

        for (Long readerId : readerIds) {
            if (!circulationRepository.existsByDocumentIdAndReaderId(documentId, readerId)) {
                Circulation circulation = Circulation.builder()
                        .documentId(documentId)
                        .readerId(readerId)
                        .status(Circulation.ReadStatus.PENDING)
                        .build();
                circulationRepository.save(circulation);
            }
        }

        return convertToDTO(document);
    }

    @Transactional
    public void markAsRead(Long documentId, Long readerId) {
        Circulation circulation = circulationRepository.findByDocumentIdAndReaderId(documentId, readerId).orElse(null);
        if (circulation != null && circulation.getStatus() == Circulation.ReadStatus.PENDING) {
            circulation.setStatus(Circulation.ReadStatus.READ);
            circulation.setReadAt(LocalDateTime.now());
            circulationRepository.save(circulation);
        }
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        circulationRepository.deleteByDocumentId(documentId);
        Document document = documentRepository.findById(documentId).orElse(null);
        if (document != null) {
            try {
                Path filePath = Paths.get(document.getFilePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.error("Failed to delete file: {}", document.getFilePath(), e);
            }
        }
        documentRepository.deleteById(documentId);
    }

    private DocumentDTO convertToDTO(Document document) {
        User uploader = userRepository.findById(document.getUploaderId()).orElse(null);

        List<Circulation> circulations = circulationRepository.findByDocumentIdOrderByCreatedAtDesc(document.getId());
        List<CirculationDTO> circulationDTOs = new ArrayList<>();

        for (Circulation c : circulations) {
            User reader = userRepository.findById(c.getReaderId()).orElse(null);
            circulationDTOs.add(CirculationDTO.builder()
                    .id(c.getId())
                    .documentId(c.getDocumentId())
                    .documentName(document.getFileName())
                    .readerId(c.getReaderId())
                    .readerName(reader != null ? reader.getName() : "Unknown")
                    .readerDepartment(reader != null ? reader.getDepartment() : "")
                    .status(c.getStatus())
                    .readAt(c.getReadAt())
                    .createdAt(c.getCreatedAt())
                    .build());
        }

        int totalReaders = circulationDTOs.size();
        int readCount = (int) circulationDTOs.stream().filter(c -> c.getStatus() == Circulation.ReadStatus.READ).count();
        int pendingCount = totalReaders - readCount;

        return DocumentDTO.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .filePath(document.getFilePath())
                .fileSize(document.getFileSize())
                .fileType(document.getFileType())
                .uploaderId(document.getUploaderId())
                .uploaderName(uploader != null ? uploader.getName() : "Unknown")
                .description(document.getDescription())
                .createdAt(document.getCreatedAt())
                .circulations(circulationDTOs)
                .totalReaders(totalReaders)
                .readCount(readCount)
                .pendingCount(pendingCount)
                .build();
    }
}
