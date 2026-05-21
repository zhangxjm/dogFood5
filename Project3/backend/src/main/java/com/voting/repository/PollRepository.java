package com.voting.repository;

import com.voting.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

    List<Poll> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Poll p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Poll> findActivePolls();
}
