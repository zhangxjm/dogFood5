package com.taskmanager.service;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.ProjectMember;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectMemberRepository;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByUser(User user) {
        List<ProjectMember> memberships = projectMemberRepository.findByUser(user);
        List<Project> ownedProjects = projectRepository.findByOwner(user);
        List<Project> memberProjects = memberships.stream()
                .map(ProjectMember::getProject)
                .collect(Collectors.toList());
        ownedProjects.addAll(memberProjects);
        return ownedProjects.stream().distinct().collect(Collectors.toList());
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project createProject(Project project, User owner) {
        project.setOwner(owner);
        Project savedProject = projectRepository.save(project);

        ProjectMember member = new ProjectMember();
        member.setProject(savedProject);
        member.setUser(owner);
        member.setRole(ProjectMember.ProjectRole.OWNER);
        projectMemberRepository.save(member);

        return savedProject;
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        project.setStartDate(projectDetails.getStartDate());
        project.setEndDate(projectDetails.getEndDate());
        project.setStatus(projectDetails.getStatus());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        List<Task> tasks = taskRepository.findByProject(project);
        taskRepository.deleteAll(tasks);
        List<ProjectMember> members = projectMemberRepository.findByProject(project);
        projectMemberRepository.deleteAll(members);
        projectRepository.delete(project);
    }

    public Map<String, Object> getProjectStatistics(Long projectId) {
        Project project = getProjectById(projectId);
        Map<String, Object> stats = new HashMap<>();

        List<Task> tasks = taskRepository.findByProject(project);
        stats.put("totalTasks", tasks.size());

        Map<String, Long> statusCounts = new HashMap<>();
        for (Task.Status status : Task.Status.values()) {
            statusCounts.put(status.name(), taskRepository.countByProjectAndStatus(project, status));
        }
        stats.put("statusCounts", statusCounts);

        double completedTasks = taskRepository.countByProjectAndStatus(project, Task.Status.DONE);
        double completionRate = tasks.isEmpty() ? 0 : (completedTasks / tasks.size()) * 100;
        stats.put("completionRate", Math.round(completionRate * 100.0) / 100.0);

        double avgProgress = tasks.stream()
                .mapToInt(Task::getProgress)
                .average()
                .orElse(0);
        stats.put("averageProgress", Math.round(avgProgress * 100.0) / 100.0);

        List<ProjectMember> members = projectMemberRepository.findByProject(project);
        stats.put("teamSize", members.size());

        return stats;
    }
}
