package com.hotel.linen.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "usage_record")
public class UsageRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "linen_id")
    private Long linenId;

    @Column(name = "linen_name", length = 100)
    private String linenName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "user_name", length = 50)
    private String userName;

    @Column(name = "department", length = 100)
    private String department;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "use_time")
    private LocalDateTime useTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "return_time")
    private LocalDateTime returnTime;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "remark", length = 500)
    private String remark;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        if (useTime == null) {
            useTime = LocalDateTime.now();
        }
    }
}
