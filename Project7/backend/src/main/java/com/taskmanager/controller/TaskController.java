package com.taskmanager.controller;

import com.taskmanager.config.JwtTokenUtil;
import com.taskmanager.dto.ApiResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.service.AuthService;
import com.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

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
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<Task>>> getMyTasks(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        List<Task> tasks = taskService.getTasksByAssignee(user);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<Task>> createTask(
            @PathVariable Long projectId,
            @RequestBody Task task,
            @RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        Task createdTask = taskService.createTask(task, projectId, user);
        return ResponseEntity.ok(ApiResponse.success("Task created successfully", createdTask));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(
            @PathVariable Long id,
            @RequestBody Task taskDetails) {
        Task updatedTask = taskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updatedTask));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<Task>> updateTaskProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer progress = request.get("progress");
        Task updatedTask = taskService.updateTaskProgress(id, progress);
        return ResponseEntity.ok(ApiResponse.success("Task progress updated successfully", updatedTask));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Task>> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Task.Status status = Task.Status.valueOf(request.get("status"));
        Task updatedTask = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updatedTask));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<Task>> assignTask(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request,
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        Task updatedTask = taskService.assignTask(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Task assigned successfully", updatedTask));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
