package com.voting.service;

import com.voting.dto.PollRequest;
import com.voting.dto.VoteRequest;
import com.voting.entity.Poll;
import com.voting.entity.PollOption;
import com.voting.entity.VoteRecord;
import com.voting.repository.PollRepository;
import com.voting.repository.PollOptionRepository;
import com.voting.repository.VoteRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final VoteRecordRepository voteRecordRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<Poll> getAllPolls() {
        return pollRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Poll> getActivePolls() {
        return pollRepository.findActivePolls();
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    @Transactional
    public Poll createPoll(PollRequest request) {
        Poll poll = new Poll();
        poll.setTitle(request.getTitle());
        poll.setDescription(request.getDescription());
        poll.setDeadline(request.getDeadline());
        poll.setAllowMultiple(request.getAllowMultiple() != null ? request.getAllowMultiple() : false);
        poll.setIsActive(true);
        poll.setCreatedAt(LocalDateTime.now());

        jdbcTemplate.update(
            "INSERT INTO polls (title, description, created_at, deadline, is_active, allow_multiple) VALUES (?, ?, ?, ?, ?, ?)",
            poll.getTitle(),
            poll.getDescription(),
            poll.getCreatedAt(),
            poll.getDeadline(),
            poll.getIsActive(),
            poll.getAllowMultiple()
        );

        Long pollId = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
        poll.setId(pollId);

        for (String optionText : request.getOptions()) {
            PollOption option = new PollOption(optionText);
            option.setPoll(poll);
            
            jdbcTemplate.update(
                "INSERT INTO poll_options (text, vote_count, poll_id) VALUES (?, ?, ?)",
                option.getText(),
                option.getVoteCount(),
                poll.getId()
            );
        }

        return poll;
    }

    @Transactional
    public void vote(Long pollId, VoteRequest request) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("投票不存在"));

        if (!poll.isVotable()) {
            throw new RuntimeException("该投票已结束或未激活");
        }

        if (voteRecordRepository.existsByPollIdAndVoterIdentifier(pollId, request.getVoterIdentifier())) {
            throw new RuntimeException("您已经投过票了");
        }

        if (!poll.getAllowMultiple() && request.getOptionIds().size() > 1) {
            throw new RuntimeException("该投票不允许多选");
        }

        for (Long optionId : request.getOptionIds()) {
            PollOption option = pollOptionRepository.findById(optionId)
                    .orElseThrow(() -> new RuntimeException("选项不存在"));

            if (!option.getPoll().getId().equals(pollId)) {
                throw new RuntimeException("选项不属于该投票");
            }

            jdbcTemplate.update(
                "UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?",
                optionId
            );

            jdbcTemplate.update(
                "INSERT INTO vote_records (voter_identifier, option_id, poll_id, voted_at) VALUES (?, ?, ?, ?)",
                request.getVoterIdentifier(),
                optionId,
                pollId,
                LocalDateTime.now()
            );
        }
    }

    @Transactional
    public void closePoll(Long pollId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("投票不存在"));
        poll.setIsActive(false);
        pollRepository.save(poll);
    }

    public boolean hasVoted(Long pollId, String voterIdentifier) {
        return voteRecordRepository.existsByPollIdAndVoterIdentifier(pollId, voterIdentifier);
    }

    public List<VoteRecord> getVoteHistory(String voterIdentifier) {
        return voteRecordRepository.findByVoterIdentifierOrderByVotedAtDesc(voterIdentifier);
    }
}
