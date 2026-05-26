CREATE DATABASE IF NOT EXISTS nail_schedule DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE nail_schedule;

CREATE TABLE IF NOT EXISTS technician (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    name VARCHAR(50) NOT NULL COMMENT 'name',
    phone VARCHAR(20) COMMENT 'phone',
    specialty VARCHAR(200) COMMENT 'specialty',
    status TINYINT DEFAULT 1 COMMENT 'status 1-active 0-inactive',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='technician';

CREATE TABLE IF NOT EXISTS schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    technician_id BIGINT NOT NULL COMMENT 'technician id',
    schedule_date DATE NOT NULL COMMENT 'schedule date',
    start_time TIME NOT NULL COMMENT 'start time',
    end_time TIME NOT NULL COMMENT 'end time',
    shift_type VARCHAR(20) COMMENT 'shift type: MORNING/AFTERNOON/NIGHT/FULL',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    INDEX idx_tech_date (technician_id, schedule_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='schedule';

CREATE TABLE IF NOT EXISTS appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    customer_name VARCHAR(50) NOT NULL COMMENT 'customer name',
    customer_phone VARCHAR(20) NOT NULL COMMENT 'customer phone',
    technician_id BIGINT NOT NULL COMMENT 'technician id',
    appointment_date DATE NOT NULL COMMENT 'appointment date',
    appointment_time TIME NOT NULL COMMENT 'appointment time',
    service_type VARCHAR(100) COMMENT 'service type',
    status TINYINT DEFAULT 1 COMMENT 'status 1-pending 2-confirmed 3-completed 4-cancelled',
    remark VARCHAR(500) COMMENT 'remark',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
    INDEX idx_date (appointment_date),
    INDEX idx_tech_date (technician_id, appointment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='appointment';

CREATE TABLE IF NOT EXISTS service_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    name VARCHAR(100) NOT NULL COMMENT 'service name',
    description VARCHAR(500) COMMENT 'description',
    duration INT COMMENT 'duration in minutes',
    price DECIMAL(10,2) COMMENT 'price',
    status TINYINT DEFAULT 1 COMMENT 'status 1-active 0-inactive',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='service item';
