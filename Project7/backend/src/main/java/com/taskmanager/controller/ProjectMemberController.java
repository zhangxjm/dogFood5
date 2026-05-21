package com.taskmanager.controller;

import com.taskmanager.dto.ApiResponse;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectMember>>> getProjectMembers(@PathVariable Long projectId) {
        List<ProjectMember> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectMember>> addMember(
            @PathVariable Long projectId,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        ProjectMember.ProjectRole role = ProjectMember.ProjectRole.valueOf(
                request.getOrDefault("role", "MEMBER").toString()
        );
        ProjectMember member = projectMemberService.addMember(projectId, userId, role);
        return ResponseEntity.ok(ApiResponse.success("Member added successfully", member));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<ProjectMember>> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        ProjectMember.ProjectRole role = ProjectMember.ProjectRole.valueOf(request.get("role"));
        ProjectMember member = projectMemberService.updateMemberRole(projectId, userId, role);
        return ResponseEntity.ok(ApiResponse.success("Member role updated successfully", member));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        projectMemberService.removeMember(projectId, userId);
        return ResponseEntity.ok(ApiResponse.success("Member removed successfully", null));
    }
}
