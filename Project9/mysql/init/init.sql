SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS fresh_food_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fresh_food_db;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    role VARCHAR(50) DEFAULT 'admin' COMMENT '角色',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '用户表';

CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '食材分类表';

CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
    name VARCHAR(100) NOT NULL COMMENT '商品名称',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    unit VARCHAR(20) COMMENT '单位',
    image VARCHAR(500) COMMENT '图片URL',
    description TEXT COMMENT '商品描述',
    status TINYINT DEFAULT 1 COMMENT '状态 0-下架 1-上架',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '商品表';

CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '库存ID',
    product_id BIGINT NOT NULL UNIQUE COMMENT '商品ID',
    quantity INT DEFAULT 0 COMMENT '库存数量',
    warning_quantity INT DEFAULT 10 COMMENT '预警数量',
    last_check_time DATETIME COMMENT '上次盘点时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '库存表';

CREATE TABLE IF NOT EXISTS inventory_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    before_quantity INT COMMENT '盘点前数量',
    after_quantity INT COMMENT '盘点后数量',
    diff_quantity INT COMMENT '差异数量',
    remark VARCHAR(500) COMMENT '备注',
    operator_id BIGINT COMMENT '操作人ID',
    operator_name VARCHAR(50) COMMENT '操作人姓名',
    check_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '盘点时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_product (product_id),
    INDEX idx_check_time (check_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '库存盘点记录表';

CREATE TABLE IF NOT EXISTS supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '供应商ID',
    name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    contact_person VARCHAR(50) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(500) COMMENT '地址',
    email VARCHAR(100) COMMENT '邮箱',
    status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '供应商表';

CREATE TABLE IF NOT EXISTS supply_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '供货记录ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL COMMENT '供货数量',
    price DECIMAL(10,2) COMMENT '供货单价',
    total_amount DECIMAL(12,2) COMMENT '总金额',
    supply_date DATE COMMENT '供货日期',
    remark VARCHAR(500) COMMENT '备注',
    operator_id BIGINT COMMENT '操作人ID',
    operator_name VARCHAR(50) COMMENT '操作人姓名',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_supplier (supplier_id),
    INDEX idx_product (product_id),
    INDEX idx_supply_date (supply_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '供货记录表';

CREATE TABLE IF NOT EXISTS sale_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '销售记录ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL COMMENT '销售数量',
    price DECIMAL(10,2) COMMENT '销售单价',
    total_amount DECIMAL(12,2) COMMENT '总金额',
    sale_date DATE COMMENT '销售日期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记',
    INDEX idx_product (product_id),
    INDEX idx_sale_date (sale_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT '销售记录表';

INSERT INTO sys_user (username, password, real_name, phone, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', '管理员', '13800138000', 'admin');

INSERT INTO category (name, parent_id, sort) VALUES
('蔬菜类', 0, 1),
('水果类', 0, 2),
('肉类', 0, 3),
('海鲜类', 0, 4),
('粮油类', 0, 5),
('叶菜', 1, 1),
('根茎', 1, 2),
('鲜果', 2, 1),
('猪肉', 3, 1),
('牛肉', 3, 2);

INSERT INTO product (name, category_id, price, unit, description, status) VALUES
('大白菜', 6, 2.50, '斤', '新鲜大白菜，产地直供', 1),
('菠菜', 6, 3.00, '斤', '有机菠菜，营养丰富', 1),
('胡萝卜', 7, 2.80, '斤', '胡萝卜，富含胡萝卜素', 1),
('土豆', 7, 1.80, '斤', '优质土豆，口感粉糯', 1),
('苹果', 8, 8.50, '斤', '红富士苹果，脆甜多汁', 1),
('香蕉', 8, 5.00, '斤', '进口香蕉，香甜软糯', 1),
('五花肉', 9, 28.00, '斤', '新鲜五花肉，肥瘦相间', 1),
('瘦肉', 9, 35.00, '斤', '精瘦肉，肉质鲜嫩', 1);

INSERT INTO inventory (product_id, quantity, warning_quantity) VALUES
(1, 100, 20),
(2, 80, 15),
(3, 120, 25),
(4, 150, 30),
(5, 60, 10),
(6, 90, 15),
(7, 40, 10),
(8, 50, 10);

INSERT INTO supplier (name, contact_person, phone, address) VALUES
('绿源蔬菜基地', '张经理', '13900139001', '山东省寿光市蔬菜产业园'),
('优果水果批发', '李总', '13900139002', '广东省广州市江南水果市场'),
('鲜肉屠宰场', '王厂长', '13900139003', '河南省郑州市肉类加工园区');

INSERT INTO sale_record (product_id, quantity, price, total_amount, sale_date) VALUES
(1, 20, 2.50, 50.00, '2024-01-01'),
(1, 15, 2.50, 37.50, '2024-01-02'),
(2, 10, 3.00, 30.00, '2024-01-01'),
(5, 25, 8.50, 212.50, '2024-01-01'),
(7, 8, 28.00, 224.00, '2024-01-01'),
(1, 5, 2.50, 12.50, '2024-01-15');
