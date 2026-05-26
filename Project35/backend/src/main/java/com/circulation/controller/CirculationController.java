package com.circulation.controller;

import com.circulation.dto.CirculationDTO;
import com.circulation.entity.Circulation.ReadStatus;
import com.circulation.service.CirculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circulations")
@RequiredArgsConstructor
public class CirculationController {

    private final CirculationService circulationService;

    @GetMapping("/reader/{readerId}")
    public ResponseEntity<List<CirculationDTO>> getCirculationsByReader(@PathVariable Long readerId) {
        return ResponseEntity.ok(circulationService.getCirculationsByReader(readerId));
    }

    @GetMapping("/reader/{readerId}/status/{status}")
    public ResponseEntity<List<CirculationDTO>> getCirculationsByReaderAndStatus(
            @PathVariable Long readerId,
            @PathVariable ReadStatus status) {
        return ResponseEntity.ok(circulationService.getCirculationsByReaderAndStatus(readerId, status));
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<CirculationDTO>> getCirculationsByDocument(@PathVariable Long documentId) {
        return ResponseEntity.ok(circulationService.getCirculationsByDocument(documentId));
    }

    @GetMapping("/document/{documentId}/reader/{readerId}")
    public ResponseEntity<CirculationDTO> getCirculation(
            @PathVariable Long documentId,
            @PathVariable Long readerId) {
        CirculationDTO circulation = circulationService.getCirculation(documentId, readerId);
        if (circulation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(circulation);
    }

    @GetMapping("/document/{documentId}/stats")
    public ResponseEntity<?> getDocumentStats(@PathVariable Long documentId) {
        return ResponseEntity.ok(java.util.Map.of(
                "totalReaders", circulationService.getTotalReaders(documentId),
                "readCount", circulationService.getReadCount(documentId),
                "pendingCount", circulationService.getPendingCount(documentId)
        ));
    }
}
