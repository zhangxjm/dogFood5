SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS material_manage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE material_manage;

CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '材料名称',
    specification VARCHAR(100) COMMENT '规格型号',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    quantity INT DEFAULT 0 COMMENT '库存数量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='材料表';

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '班组名称',
    leader VARCHAR(50) COMMENT '负责人',
    phone VARCHAR(20) COMMENT '联系电话',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班组表';

CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL COMMENT '材料ID',
    team_id INT NOT NULL COMMENT '班组ID',
    quantity INT NOT NULL COMMENT '领用数量',
    type TINYINT NOT NULL DEFAULT 1 COMMENT '类型:1-领用,2-归还',
    operator VARCHAR(50) COMMENT '经办人',
    remark VARCHAR(255) COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_material (material_id),
    INDEX idx_team (team_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='领用记录表';

INSERT INTO materials (name, specification, unit, quantity) VALUES
('水泥', 'P.O 42.5', '袋', 500),
('钢筋', 'Φ16', '吨', 50),
('红砖', '240×115×53', '块', 10000),
('沙子', '中砂', '立方米', 200),
('石子', '5-25mm', '立方米', 150);

INSERT INTO teams (name, leader, phone) VALUES
('土建一班', '张三', '13800138001'),
('土建二班', '李四', '13800138002'),
('水电班', '王五', '13800138003'),
('装修班', '赵六', '13800138004');
