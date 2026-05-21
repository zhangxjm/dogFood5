CREATE DATABASE IF NOT EXISTS fishing_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fishing_store;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '品类名称',
    description TEXT COMMENT '品类描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='渔具品类表';

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL COMMENT '所属品类ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    specification VARCHAR(200) COMMENT '规格型号',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    stock_quantity INT NOT NULL DEFAULT 0 COMMENT '库存数量',
    warning_quantity INT NOT NULL DEFAULT 10 COMMENT '预警数量',
    supplier VARCHAR(200) COMMENT '供应商',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品库存表';

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '客户姓名',
    phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(500) COMMENT '地址',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户信息表';

CREATE TABLE IF NOT EXISTS purchase_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL COMMENT '客户ID',
    product_id INT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL COMMENT '购买数量',
    unit_price DECIMAL(10,2) NOT NULL COMMENT '单价',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '购买日期',
    remark TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_customer (customer_id),
    INDEX idx_product (product_id),
    INDEX idx_date (purchase_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购记录表';

INSERT INTO categories (name, description) VALUES
('鱼竿', '各类钓鱼竿，包括手竿、海竿、路亚竿等'),
('鱼线', '各种型号钓鱼线'),
('鱼钩', '各类鱼钩'),
('鱼饵', '各类鱼饵、饵料'),
('鱼漂', '各类鱼漂、浮漂'),
('渔具配件', '其他渔具配件');

INSERT INTO products (category_id, name, specification, price, stock_quantity, warning_quantity, supplier) VALUES
(1, '碳素手竿', '3.6米 28调', 299.00, 15, 5, '威海渔具厂'),
(1, '海竿套装', '2.7米 带轮', 199.00, 8, 3, '河北渔具公司'),
(2, '尼龙鱼线', '500米 4号', 35.00, 50, 10, '东阳线业'),
(3, '伊势尼鱼钩', '3-12号 各型号', 15.00, 100, 20, '日本进口'),
(4, '野战蓝鲫', '300g/包', 12.00, 80, 15, '龙王恨'),
(5, '纳米鱼漂', '立式浮漂', 25.00, 45, 10, '湖南浮漂厂'),
(6, '钓鱼伞', '2.2米 万向', 89.00, 12, 3, '浙江伞具厂'),
(1, '路亚竿套装', '2.1米 M调', 459.00, 5, 2, '广州路亚'),
(4, '红虫粉', '100g/瓶', 18.00, 25, 8, '山东饵料厂'),
(6, '抄网', '3米 铝合金', 45.00, 18, 5, '河北渔具公司');

INSERT INTO customers (name, phone, address) VALUES
('张三', '13800138001', '北京市朝阳区'),
('李四', '13800138002', '上海市浦东新区'),
('王五', '13800138003', '广州市天河区'),
('赵六', '13800138004', '深圳市南山区'),
('孙七', '13800138005', '杭州市西湖区');
