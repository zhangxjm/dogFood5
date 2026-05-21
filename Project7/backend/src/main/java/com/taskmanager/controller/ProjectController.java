package com.taskmanager.controller;

import com.taskmanager.config.JwtTokenUtil;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.service.AuthService;
import com.taskmanager.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private AuthService authService;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        return authService.getCurrentUser(username);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        List<Project> projects = projectService.getProjectsByUser(user);
        return ResponseEntity.ok(ApiResponse.success(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(
            @RequestBody Project project,
            @RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        Project createdProject = projectService.createProject(project, user);
        return ResponseEntity.ok(ApiResponse.success("Project created successfully", createdProject));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @PathVariable Long id,
            @RequestBody Project projectDetails) {
        Project updatedProject = projectService.updateProject(id, projectDetails);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updatedProject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectStatistics(@PathVariable Long id) {
        Map<String, Object> statistics = projectService.getProjectStatistics(id);
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}
