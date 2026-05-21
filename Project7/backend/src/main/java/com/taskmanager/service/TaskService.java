package com.taskmanager.service;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return taskRepository.findByProject(project);
    }

    public List<Task> getTasksByAssignee(User assignee) {
        return taskRepository.findByAssignee(assignee);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task createTask(Task task, Long projectId, User creator) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);
        task.setCreator(creator);
        if (task.getProgress() == null) {
            task.setProgress(0);
        }
        if (task.getStatus() == null) {
            task.setStatus(Task.Status.TODO);
        }
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setProgress(taskDetails.getProgress());
        task.setStartDate(taskDetails.getStartDate());
        task.setDueDate(taskDetails.getDueDate());
        if (taskDetails.getAssignee() != null) {
            task.setAssignee(taskDetails.getAssignee());
        }
        return taskRepository.save(task);
    }

    public Task updateTaskProgress(Long id, Integer progress) {
        Task task = getTaskById(id);
        task.setProgress(progress);
        if (progress >= 100) {
            task.setStatus(Task.Status.DONE);
        } else if (progress > 0) {
            task.setStatus(Task.Status.IN_PROGRESS);
        }
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, Task.Status status) {
        Task task = getTaskById(id);
        task.setStatus(status);
        if (status == Task.Status.DONE) {
            task.setProgress(100);
        }
        return taskRepository.save(task);
    }

    public Task assignTask(Long id, User assignee) {
        Task task = getTaskById(id);
        task.setAssignee(assignee);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}
