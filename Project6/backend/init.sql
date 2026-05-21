SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS farm_sales CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE farm_sales;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'on_sale',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    email VARCHAR(255),
    total_orders INT DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_phone (phone)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(100) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    address TEXT,
    phone VARCHAR(50),
    receiver_name VARCHAR(255),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_status_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO products (name, category, price, stock, unit, description, status) VALUES
('有机白菜', '蔬菜', 3.50, 100, '斤', '新鲜有机种植，无农药残留', 'on_sale'),
('红富士苹果', '水果', 8.00, 200, '斤', '烟台红富士，脆甜多汁', 'on_sale'),
('土鸡蛋', '禽蛋', 1.50, 500, '个', '散养土鸡蛋，营养丰富', 'on_sale'),
('有机西红柿', '蔬菜', 5.00, 80, '斤', '自然成熟，酸甜可口', 'on_sale'),
('农家大米', '粮食', 6.00, 300, '斤', '当年新米，香糯可口', 'on_sale');

INSERT INTO customers (name, phone, address, total_orders, total_amount) VALUES
('张三', '13800138001', '北京市朝阳区XX街道', 5, 350.00),
('李四', '13800138002', '上海市浦东新区XX路', 3, 200.00),
('王五', '13800138003', '广州市天河区XX大道', 8, 680.00);

INSERT INTO orders (order_no, customer_id, total_amount, status, address, phone, receiver_name) VALUES
('ORD20240101001', 1, 87.50, 'completed', '北京市朝阳区XX街道', '13800138001', '张三'),
('ORD20240102001', 2, 48.00, 'shipped', '上海市浦东新区XX路', '13800138002', '李四'),
('ORD20240103001', 3, 120.00, 'pending', '广州市天河区XX大道', '13800138003', '王五');

INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES
(1, 1, '有机白菜', 3.50, 10, 35.00),
(1, 3, '土鸡蛋', 1.50, 20, 30.00),
(1, 5, '农家大米', 6.00, 3.75, 22.50),
(2, 2, '红富士苹果', 8.00, 6, 48.00),
(3, 4, '有机西红柿', 5.00, 24, 120.00);
