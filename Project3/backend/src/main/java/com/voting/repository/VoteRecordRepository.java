package com.voting.repository;

import com.voting.entity.VoteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {

    boolean existsByPollIdAndVoterIdentifier(Long pollId, String voterIdentifier);

    List<VoteRecord> findByPollIdOrderByVotedAtDesc(Long pollId);

    List<VoteRecord> findByVoterIdentifierOrderByVotedAtDesc(String voterIdentifier);

    long countByPollId(Long pollId);
}
