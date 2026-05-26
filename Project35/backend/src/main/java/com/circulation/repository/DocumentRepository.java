package com.circulation.repository;

import com.circulation.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUploaderIdOrderByCreatedAtDesc(Long uploaderId);

    @Query("SELECT d FROM Document d ORDER BY d.createdAt DESC")
    List<Document> findAllOrderByCreatedAtDesc();
}
