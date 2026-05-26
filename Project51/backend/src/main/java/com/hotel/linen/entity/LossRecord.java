package com.hotel.linen.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "loss_record")
public class LossRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "linen_id")
    private Long linenId;

    @Column(name = "linen_name", length = 100)
    private String linenName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "reason", length = 500)
    private String reason;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "loss_time")
    private LocalDateTime lossTime;

    @Column(name = "recorder", length = 50)
    private String recorder;

    @Column(name = "remark", length = 500)
    private String remark;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        if (lossTime == null) {
            lossTime = LocalDateTime.now();
        }
    }
}
