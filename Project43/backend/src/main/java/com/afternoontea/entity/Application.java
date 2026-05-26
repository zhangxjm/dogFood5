package com.afternoontea.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "application")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String remark;

    @Column(name = "apply_time")
    private LocalDateTime applyTime;

    @Column(name = "approve_time")
    private LocalDateTime approveTime;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        applyTime = LocalDateTime.now();
        if (status == null) {
            status = "AUTO_APPROVED";
        }
        approveTime = LocalDateTime.now();
    }
}
