SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS category (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  category_name VARCHAR(100) NOT NULL COMMENT '品类名称',
  category_code VARCHAR(50) NOT NULL COMMENT '品类编码',
  description VARCHAR(500) DEFAULT NULL COMMENT '描述',
  sort_order INT DEFAULT 1 COMMENT '排序',
  status INT DEFAULT 1 COMMENT '状态 0禁用 1启用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  UNIQUE KEY uk_category_code (category_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文具品类表';

CREATE TABLE IF NOT EXISTS purchase_item (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  item_name VARCHAR(100) NOT NULL COMMENT '文具名称',
  category_id BIGINT NOT NULL COMMENT '品类ID',
  specification VARCHAR(200) DEFAULT NULL COMMENT '规格',
  unit VARCHAR(20) DEFAULT NULL COMMENT '单位',
  unit_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '单价',
  stock_quantity INT DEFAULT 0 COMMENT '库存数量',
  description VARCHAR(500) DEFAULT NULL COMMENT '描述',
  status INT DEFAULT 1 COMMENT '状态 0禁用 1启用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  KEY idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文具清单表';

CREATE TABLE IF NOT EXISTS purchase_order (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
  supplier VARCHAR(200) DEFAULT NULL COMMENT '供应商',
  total_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT '总金额',
  status INT DEFAULT 0 COMMENT '状态 0待审核 1已审核 2已入库',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '订单日期',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  UNIQUE KEY uk_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购订单表';

CREATE TABLE IF NOT EXISTS purchase_order_detail (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  order_id BIGINT NOT NULL COMMENT '订单ID',
  item_id BIGINT NOT NULL COMMENT '文具ID',
  item_name VARCHAR(100) NOT NULL COMMENT '文具名称',
  specification VARCHAR(200) DEFAULT NULL COMMENT '规格',
  unit VARCHAR(20) DEFAULT NULL COMMENT '单位',
  unit_price DECIMAL(10,2) DEFAULT 0.00 COMMENT '单价',
  quantity INT NOT NULL COMMENT '数量',
  amount DECIMAL(12,2) DEFAULT 0.00 COMMENT '金额',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  KEY idx_order_id (order_id),
  KEY idx_item_id (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购订单明细表';

CREATE TABLE IF NOT EXISTS stock_in (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  order_id BIGINT NOT NULL COMMENT '订单ID',
  stock_in_no VARCHAR(50) NOT NULL COMMENT '入库单号',
  status INT DEFAULT 1 COMMENT '状态 1已入库',
  operator VARCHAR(50) DEFAULT NULL COMMENT '操作人',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  stock_in_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '入库日期',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  UNIQUE KEY uk_stock_in_no (stock_in_no),
  KEY idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库记录表';

CREATE TABLE IF NOT EXISTS department (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  dept_name VARCHAR(100) NOT NULL COMMENT '部门名称',
  dept_code VARCHAR(50) NOT NULL COMMENT '部门编码',
  sort_order INT DEFAULT 1 COMMENT '排序',
  status INT DEFAULT 1 COMMENT '状态 0禁用 1启用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  UNIQUE KEY uk_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

CREATE TABLE IF NOT EXISTS claim_record (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
  dept_id BIGINT NOT NULL COMMENT '部门ID',
  item_id BIGINT NOT NULL COMMENT '文具ID',
  item_name VARCHAR(100) NOT NULL COMMENT '文具名称',
  quantity INT NOT NULL COMMENT '申领数量',
  applicant VARCHAR(50) DEFAULT NULL COMMENT '申领人',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  claim_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '申领日期',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deleted INT DEFAULT 0 COMMENT '删除标志 0未删除 1已删除',
  KEY idx_dept_id (dept_id),
  KEY idx_item_id (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='申领记录表';

INSERT INTO category (category_name, category_code, description, sort_order) VALUES
('书写工具', 'WRITE', '笔类等书写工具', 1),
('文件管理', 'FILE', '文件夹、文件袋等', 2),
('纸品本册', 'PAPER', '打印纸、笔记本等', 3),
('办公辅助', 'AUX', '订书机、计算器等', 4);

INSERT INTO department (dept_name, dept_code, sort_order) VALUES
('行政部', 'ADMIN', 1),
('财务部', 'FINANCE', 2),
('技术部', 'TECH', 3),
('市场部', 'MARKET', 4),
('人事部', 'HR', 5);

INSERT INTO purchase_item (item_name, category_id, specification, unit, unit_price, stock_quantity, description) VALUES
('中性笔', 1, '0.5mm 黑色', '支', 2.50, 0, '日常书写用笔'),
('圆珠笔', 1, '0.7mm 蓝色', '支', 1.50, 0, '办公圆珠笔'),
('文件夹', 2, 'A4 蓝色', '个', 5.00, 0, '塑料文件夹'),
('文件袋', 2, 'A4 透明', '个', 1.20, 0, '透明文件袋'),
('A4打印纸', 3, '70g 500张', '包', 25.00, 0, '普通打印纸'),
('笔记本', 3, 'A5 100页', '本', 8.00, 0, '办公笔记本'),
('订书机', 4, '标准型', '个', 15.00, 0, '办公订书机'),
('计算器', 4, '12位', '个', 20.00, 0, '办公计算器');

SET FOREIGN_KEY_CHECKS = 1;
