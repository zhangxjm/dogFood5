package com.babycare.member.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String memberNo;
    
    @NotBlank(message = "姓名不能为空")
    @Column(nullable = false, length = 50)
    private String name;
    
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Column(nullable = false, unique = true, length = 20)
    private String phone;
    
    @Column(length = 10)
    private String gender;
    
    private LocalDate birthday;
    
    @Column(length = 200)
    private String address;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 500)
    private String remark;
    
    @Column(nullable = false)
    private Integer totalPoints = 0;
    
    @Column(nullable = false)
    private Integer availablePoints = 0;
    
    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal totalConsumption = java.math.BigDecimal.ZERO;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "level_id")
    private MemberLevel level;
    
    @Column(nullable = false)
    private Boolean status = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}