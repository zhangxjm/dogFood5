package com.circulation.repository;

import com.circulation.entity.Circulation;
import com.circulation.entity.Circulation.ReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CirculationRepository extends JpaRepository<Circulation, Long> {

    List<Circulation> findByDocumentIdOrderByCreatedAtDesc(Long documentId);

    List<Circulation> findByReaderIdOrderByCreatedAtDesc(Long readerId);

    List<Circulation> findByReaderIdAndStatusOrderByCreatedAtDesc(Long readerId, ReadStatus status);

    Optional<Circulation> findByDocumentIdAndReaderId(Long documentId, Long readerId);

    int countByDocumentId(Long documentId);

    int countByDocumentIdAndStatus(Long documentId, ReadStatus status);

    boolean existsByDocumentIdAndReaderId(Long documentId, Long readerId);

    void deleteByDocumentId(Long documentId);
}
