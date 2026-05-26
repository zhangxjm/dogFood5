package com.circulation.service;

import com.circulation.dto.CirculationDTO;
import com.circulation.entity.Circulation;
import com.circulation.entity.Circulation.ReadStatus;
import com.circulation.entity.Document;
import com.circulation.entity.User;
import com.circulation.repository.CirculationRepository;
import com.circulation.repository.DocumentRepository;
import com.circulation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CirculationService {

    private final CirculationRepository circulationRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public List<CirculationDTO> getCirculationsByReader(Long readerId) {
        List<Circulation> circulations = circulationRepository.findByReaderIdOrderByCreatedAtDesc(readerId);
        return circulations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CirculationDTO> getCirculationsByReaderAndStatus(Long readerId, ReadStatus status) {
        List<Circulation> circulations = circulationRepository.findByReaderIdAndStatusOrderByCreatedAtDesc(readerId, status);
        return circulations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CirculationDTO> getCirculationsByDocument(Long documentId) {
        List<Circulation> circulations = circulationRepository.findByDocumentIdOrderByCreatedAtDesc(documentId);
        return circulations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CirculationDTO getCirculation(Long documentId, Long readerId) {
        Circulation circulation = circulationRepository.findByDocumentIdAndReaderId(documentId, readerId).orElse(null);
        if (circulation == null) {
            return null;
        }
        return convertToDTO(circulation);
    }

    public int getTotalReaders(Long documentId) {
        return circulationRepository.countByDocumentId(documentId);
    }

    public int getReadCount(Long documentId) {
        return circulationRepository.countByDocumentIdAndStatus(documentId, ReadStatus.READ);
    }

    public int getPendingCount(Long documentId) {
        return circulationRepository.countByDocumentIdAndStatus(documentId, ReadStatus.PENDING);
    }

    private CirculationDTO convertToDTO(Circulation circulation) {
        Document document = documentRepository.findById(circulation.getDocumentId()).orElse(null);
        User reader = userRepository.findById(circulation.getReaderId()).orElse(null);

        return CirculationDTO.builder()
                .id(circulation.getId())
                .documentId(circulation.getDocumentId())
                .documentName(document != null ? document.getFileName() : "Unknown")
                .readerId(circulation.getReaderId())
                .readerName(reader != null ? reader.getName() : "Unknown")
                .readerDepartment(reader != null ? reader.getDepartment() : "")
                .status(circulation.getStatus())
                .readAt(circulation.getReadAt())
                .createdAt(circulation.getCreatedAt())
                .build();
    }
}
