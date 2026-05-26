package com.orchard.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "t_reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long timeSlotId;

    @Column(nullable = false, length = 50)
    private String visitorName;

    @Column(nullable = false, length = 20)
    private String visitorPhone;

    @Column(nullable = false)
    private Integer visitorCount;

    @Column(nullable = false, length = 50)
    private String orderNo;

    @Column(nullable = false, length = 10)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createTime;

    private LocalDateTime verifyTime;

    @Column(length = 500)
    private String remark;
}
