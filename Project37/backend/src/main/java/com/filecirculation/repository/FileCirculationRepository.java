package com.filecirculation.repository;

import com.filecirculation.entity.FileCirculation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileCirculationRepository extends JpaRepository<FileCirculation, Long> {
    List<FileCirculation> findByFileId(Long fileId);
    List<FileCirculation> findByReceiverId(Long receiverId);
    List<FileCirculation> findByCirculatorId(Long circulatorId);
}
