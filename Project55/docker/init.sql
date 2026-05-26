CREATE DATABASE IF NOT EXISTS jushas_manager DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE jushas_manager;

DROP TABLE IF EXISTS script_type;
CREATE TABLE script_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    difficulty INT COMMENT '1-5, 1 easiest',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS script_inventory;
CREATE TABLE script_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type_id BIGINT NOT NULL,
    min_players INT NOT NULL,
    max_players INT NOT NULL,
    duration INT COMMENT 'in minutes',
    author VARCHAR(100),
    publisher VARCHAR(200),
    description TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS session_record;
CREATE TABLE session_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    script_id BIGINT NOT NULL,
    session_name VARCHAR(200) NOT NULL,
    host_name VARCHAR(100),
    start_time DATETIME,
    end_time DATETIME,
    player_count INT DEFAULT 0,
    status INT DEFAULT 0 COMMENT '0-not started, 1-in progress, 2-completed, 3-cancelled',
    remarks TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS player_record;
CREATE TABLE player_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    player_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_name VARCHAR(100),
    score INT DEFAULT 0,
    comments VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
