CREATE DATABASE IF NOT EXISTS repair_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE repair_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'user', 'technician') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_code VARCHAR(50) NOT NULL UNIQUE,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    purchase_date DATE,
    status ENUM('normal', 'broken', 'repairing', 'scrapped') DEFAULT 'normal',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS repair_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_no VARCHAR(50) NOT NULL UNIQUE,
    device_id INT NOT NULL,
    reporter_id INT NOT NULL,
    fault_type VARCHAR(50) NOT NULL,
    fault_description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'assigned', 'repairing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS repair_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    technician_id INT NOT NULL,
    assigner_id INT NOT NULL,
    assign_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_complete_time DATETIME,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS repair_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    technician_id INT NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    fault_cause TEXT,
    solution TEXT,
    parts_used TEXT,
    cost DECIMAL(10, 2) DEFAULT 0,
    status ENUM('processing', 'completed') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (username, password, real_name, phone, role) VALUES
('admin', '$2a$10$hlMpYbNbVj3HoxsoTLgIWOH.tsvZnw1oKXJ0fbj6ihA8u9eDNVfNq', '系统管理员', '13800138000', 'admin'),
('user1', '$2a$10$hlMpYbNbVj3HoxsoTLgIWOH.tsvZnw1oKXJ0fbj6ihA8u9eDNVfNq', '张三', '13800138001', 'user'),
('tech1', '$2a$10$hlMpYbNbVj3HoxsoTLgIWOH.tsvZnw1oKXJ0fbj6ihA8u9eDNVfNq', '李工', '13800138002', 'technician'),
('tech2', '$2a$10$hlMpYbNbVj3HoxsoTLgIWOH.tsvZnw1oKXJ0fbj6ihA8u9eDNVfNq', '王工', '13800138003', 'technician');

INSERT INTO devices (device_code, device_name, device_type, location, purchase_date, status, description) VALUES
('DEV001', '联想笔记本电脑', '电脑设备', '办公室A101', '2023-01-15', 'normal', 'ThinkPad X1 Carbon'),
('DEV002', 'HP激光打印机', '打印设备', '办公室A101', '2023-03-20', 'normal', 'HP LaserJet Pro M404dn'),
('DEV003', '戴尔台式机', '电脑设备', '办公室B201', '2023-02-10', 'broken', 'Dell OptiPlex 7090'),
('DEV004', '投影机', '显示设备', '会议室301', '2022-12-01', 'normal', 'Epson CB-X50'),
('DEV005', '复印机', '打印设备', '办公室B202', '2023-04-05', 'normal', 'Canon iR-ADV C3720');
