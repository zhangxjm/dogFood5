package com.filecirculation.service;

import com.filecirculation.dto.CirculateRequest;
import com.filecirculation.entity.FileCirculation;
import com.filecirculation.entity.FileInfo;
import com.filecirculation.entity.User;
import com.filecirculation.repository.FileCirculationRepository;
import com.filecirculation.repository.FileInfoRepository;
import com.filecirculation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileCirculationService {
    private final FileCirculationRepository circulationRepository;
    private final FileInfoRepository fileInfoRepository;
    private final UserRepository userRepository;

    public List<FileCirculation> circulateFile(CirculateRequest request) {
        Optional<FileInfo> fileInfoOpt = fileInfoRepository.findById(request.getFileId());
        Optional<User> circulatorOpt = userRepository.findById(request.getCirculatorId());

        if (!fileInfoOpt.isPresent() || !circulatorOpt.isPresent()) {
            return new ArrayList<>();
        }

        FileInfo fileInfo = fileInfoOpt.get();
        User circulator = circulatorOpt.get();
        List<FileCirculation> circulations = new ArrayList<>();

        for (Long receiverId : request.getReceiverIds()) {
            Optional<User> receiverOpt = userRepository.findById(receiverId);
            if (receiverOpt.isPresent()) {
                User receiver = receiverOpt.get();
                FileCirculation circulation = new FileCirculation();
                circulation.setFileId(fileInfo.getId());
                circulation.setCirculatorId(circulator.getId());
                circulation.setCirculatorName(circulator.getRealName());
                circulation.setReceiverId(receiver.getId());
                circulation.setReceiverName(receiver.getRealName());
                circulation.setMessage(request.getMessage());
                circulations.add(circulationRepository.save(circulation));
            }
        }

        return circulations;
    }

    public List<FileCirculation> findByFileId(Long fileId) {
        return circulationRepository.findByFileId(fileId);
    }

    public List<FileCirculation> findByReceiverId(Long receiverId) {
        return circulationRepository.findByReceiverId(receiverId);
    }

    public List<FileCirculation> findByCirculatorId(Long circulatorId) {
        return circulationRepository.findByCirculatorId(circulatorId);
    }

    public FileCirculation markAsRead(Long id) {
        Optional<FileCirculation> circulationOpt = circulationRepository.findById(id);
        if (circulationOpt.isPresent()) {
            FileCirculation circulation = circulationOpt.get();
            circulation.setIsRead(true);
            circulation.setReadTime(LocalDateTime.now());
            return circulationRepository.save(circulation);
        }
        return null;
    }
}
