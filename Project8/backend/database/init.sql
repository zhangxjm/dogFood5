CREATE DATABASE IF NOT EXISTS groupbuy DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE groupbuy;

SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS leader (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '团长姓名',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    avatar VARCHAR(255) DEFAULT '' COMMENT '头像',
    id_card VARCHAR(50) DEFAULT '' COMMENT '身份证号',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='团长表';

CREATE TABLE IF NOT EXISTS pickup_point (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT NOT NULL COMMENT '团长ID',
    name VARCHAR(100) NOT NULL COMMENT '自提点名称',
    address VARCHAR(255) NOT NULL COMMENT '详细地址',
    province VARCHAR(50) DEFAULT '' COMMENT '省份',
    city VARCHAR(50) DEFAULT '' COMMENT '城市',
    district VARCHAR(50) DEFAULT '' COMMENT '区县',
    contact_name VARCHAR(50) NOT NULL COMMENT '联系人',
    contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    business_hours VARCHAR(100) DEFAULT '' COMMENT '营业时间',
    status TINYINT DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自提点表';

CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT NOT NULL COMMENT '团长ID',
    category_id INT DEFAULT 0 COMMENT '分类ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    image VARCHAR(255) DEFAULT '' COMMENT '商品图片',
    images TEXT COMMENT '商品图片集，JSON格式',
    price DECIMAL(10,2) NOT NULL COMMENT '销售价格',
    cost_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '成本价',
    commission_rate DECIMAL(5,2) DEFAULT 10.00 COMMENT '佣金比例%',
    stock INT DEFAULT 0 COMMENT '库存',
    sales INT DEFAULT 0 COMMENT '销量',
    unit VARCHAR(20) DEFAULT '件' COMMENT '单位',
    description TEXT COMMENT '商品描述',
    specs TEXT COMMENT '商品规格，JSON格式',
    status TINYINT DEFAULT 1 COMMENT '状态 1-上架 0-下架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE IF NOT EXISTS `order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    leader_id INT NOT NULL COMMENT '团长ID',
    pickup_point_id INT NOT NULL COMMENT '自提点ID',
    user_id INT NOT NULL COMMENT '用户ID',
    user_name VARCHAR(100) DEFAULT '' COMMENT '用户姓名',
    user_phone VARCHAR(20) DEFAULT '' COMMENT '用户电话',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    commission_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '佣金金额',
    status TINYINT DEFAULT 0 COMMENT '订单状态 0-待付款 1-待提货 2-已核销 3-已完成 4-已取消',
    payment_time TIMESTAMP NULL COMMENT '支付时间',
    pickup_code VARCHAR(20) DEFAULT '' COMMENT '提货码',
    verify_time TIMESTAMP NULL COMMENT '核销时间',
    verify_user_id INT DEFAULT NULL COMMENT '核销人ID',
    remark VARCHAR(255) DEFAULT '' COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_pickup_code (pickup_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE IF NOT EXISTS order_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL COMMENT '订单ID',
    product_id INT NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(255) DEFAULT '' COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    quantity INT NOT NULL COMMENT '数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '小计',
    commission_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT '佣金比例',
    commission_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '佣金金额',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

CREATE TABLE IF NOT EXISTS earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT NOT NULL COMMENT '团长ID',
    order_id INT NOT NULL COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL COMMENT '订单号',
    amount DECIMAL(10,2) NOT NULL COMMENT '收益金额',
    type TINYINT DEFAULT 1 COMMENT '收益类型 1-销售佣金 2-奖励',
    status TINYINT DEFAULT 0 COMMENT '状态 0-待结算 1-已结算 2-已提现',
    settle_time TIMESTAMP NULL COMMENT '结算时间',
    remark VARCHAR(255) DEFAULT '' COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收益表';

CREATE TABLE IF NOT EXISTS withdrawal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT NOT NULL COMMENT '团长ID',
    withdrawal_no VARCHAR(50) NOT NULL UNIQUE COMMENT '提现单号',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
    fee DECIMAL(10,2) DEFAULT 0.00 COMMENT '手续费',
    actual_amount DECIMAL(10,2) NOT NULL COMMENT '实际到账金额',
    account_type TINYINT DEFAULT 1 COMMENT '账户类型 1-微信 2-支付宝 3-银行卡',
    account_name VARCHAR(100) NOT NULL COMMENT '账户姓名',
    account_no VARCHAR(100) NOT NULL COMMENT '账户号码',
    bank_name VARCHAR(100) DEFAULT '' COMMENT '银行名称',
    status TINYINT DEFAULT 0 COMMENT '状态 0-待审核 1-审核通过 2-审核拒绝 3-已打款',
    audit_time TIMESTAMP NULL COMMENT '审核时间',
    audit_remark VARCHAR(255) DEFAULT '' COMMENT '审核备注',
    pay_time TIMESTAMP NULL COMMENT '打款时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现表';

CREATE TABLE IF NOT EXISTS leader_wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT NOT NULL UNIQUE COMMENT '团长ID',
    total_earnings DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计收益',
    available_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '可提现余额',
    frozen_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '冻结余额',
    total_withdrawal DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计提现',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leader_id (leader_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='团长钱包表';

INSERT INTO category (name, sort_order) VALUES 
('生鲜果蔬', 1),
('肉禽蛋奶', 2),
('粮油调味', 3),
('休闲零食', 4),
('日用百货', 5);

INSERT INTO leader (name, phone, password) VALUES 
('张团长', '13800138000', 'e10adc3949ba59abbe56e057f20f883e');

INSERT INTO leader_wallet (leader_id) VALUES (1);

INSERT INTO pickup_point (leader_id, name, address, contact_name, contact_phone, business_hours) VALUES 
(1, '张团长社区店', '北京市朝阳区幸福小区1号楼1单元101室', '张团长', '13800138000', '08:00-20:00');
