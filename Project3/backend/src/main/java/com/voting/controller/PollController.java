package com.voting.controller;

import com.voting.dto.ApiResponse;
import com.voting.dto.PollRequest;
import com.voting.dto.VoteRequest;
import com.voting.entity.Poll;
import com.voting.entity.VoteRecord;
import com.voting.service.PollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8080"})
public class PollController {

    private final PollService pollService;

    @GetMapping
    public ApiResponse<List<Poll>> getAllPolls() {
        return ApiResponse.success(pollService.getAllPolls());
    }

    @GetMapping("/active")
    public ApiResponse<List<Poll>> getActivePolls() {
        return ApiResponse.success(pollService.getActivePolls());
    }

    @GetMapping("/{id}")
    public ApiResponse<Poll> getPollById(@PathVariable Long id) {
        return pollService.getPollById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("投票不存在"));
    }

    @PostMapping
    public ApiResponse<Poll> createPoll(@Valid @RequestBody PollRequest request) {
        try {
            Poll poll = pollService.createPoll(request);
            return ApiResponse.success("投票创建成功", poll);
        } catch (Exception e) {
            return ApiResponse.error("创建投票失败: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/vote")
    public ApiResponse<Void> vote(@PathVariable Long id, @Valid @RequestBody VoteRequest request) {
        try {
            pollService.vote(id, request);
            return ApiResponse.success("投票成功", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}/close")
    public ApiResponse<Void> closePoll(@PathVariable Long id) {
        try {
            pollService.closePoll(id);
            return ApiResponse.success("投票已关闭", null);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}/has-voted")
    public ApiResponse<Boolean> hasVoted(@PathVariable Long id, @RequestParam String voterId) {
        return ApiResponse.success(pollService.hasVoted(id, voterId));
    }

    @GetMapping("/history")
    public ApiResponse<List<VoteRecord>> getVoteHistory(@RequestParam String voterId) {
        return ApiResponse.success(pollService.getVoteHistory(voterId));
    }
}
