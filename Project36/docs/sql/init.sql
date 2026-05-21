CREATE DATABASE IF NOT EXISTS warehouse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE warehouse;

CREATE TABLE `warehouse_area` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '库区ID',
  `area_code` varchar(50) NOT NULL COMMENT '库区编号',
  `area_name` varchar(100) NOT NULL COMMENT '库区名称',
  `area_type` tinyint NOT NULL DEFAULT '1' COMMENT '库区类型 1-原材料 2-半成品 3-成品 4-危险物品',
  `location` varchar(200) DEFAULT NULL COMMENT '库区位置',
  `manager` varchar(50) DEFAULT NULL COMMENT '负责人',
  `phone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态 1-启用 0-禁用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_area_code` (`area_code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料库区表';

CREATE TABLE `material` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '物料ID',
  `material_code` varchar(50) NOT NULL COMMENT '物料编号',
  `material_name` varchar(100) NOT NULL COMMENT '物料名称',
  `specification` varchar(200) DEFAULT NULL COMMENT '规格型号',
  `unit` varchar(20) DEFAULT NULL COMMENT '计量单位',
  `category` varchar(50) DEFAULT NULL COMMENT '物料分类',
  `warehouse_area_id` bigint unsigned NOT NULL COMMENT '所属库区ID',
  `quantity` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '库存数量',
  `min_stock` decimal(12,2) DEFAULT '0.00' COMMENT '最低库存',
  `max_stock` decimal(12,2) DEFAULT '999999.99' COMMENT '最高库存',
  `price` decimal(12,2) DEFAULT '0.00' COMMENT '单价',
  `supplier` varchar(100) DEFAULT NULL COMMENT '供应商',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态 1-正常 0-停用',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_material_code` (`material_code`),
  KEY `idx_warehouse_area_id` (`warehouse_area_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料表';

CREATE TABLE `inventory_record` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `record_no` varchar(50) NOT NULL COMMENT '流水号',
  `material_id` bigint unsigned NOT NULL COMMENT '物料ID',
  `type` tinyint NOT NULL COMMENT '类型 1-入库 2-出库',
  `quantity` decimal(12,2) NOT NULL COMMENT '数量',
  `before_quantity` decimal(12,2) NOT NULL COMMENT '操作前数量',
  `after_quantity` decimal(12,2) NOT NULL COMMENT '操作后数量',
  `operator` varchar(50) DEFAULT NULL COMMENT '操作人',
  `operate_time` datetime NOT NULL COMMENT '操作时间',
  `reason` varchar(200) DEFAULT NULL COMMENT '出入库原因',
  `batch_no` varchar(50) DEFAULT NULL COMMENT '批次号',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_record_no` (`record_no`),
  KEY `idx_material_id` (`material_id`),
  KEY `idx_type` (`type`),
  KEY `idx_operate_time` (`operate_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料出入库流水记录表';

INSERT INTO `warehouse_area` (`area_code`, `area_name`, `area_type`, `location`, `manager`, `phone`, `status`) VALUES
('A001', '原材料库区A', 1, '厂房一楼A区', '张三', '13800138001', 1),
('B001', '半成品库区B', 2, '厂房一楼B区', '李四', '13800138002', 1),
('C001', '成品库区C', 3, '厂房二楼C区', '王五', '13800138003', 1);

INSERT INTO `material` (`material_code`, `material_name`, `specification`, `unit`, `category`, `warehouse_area_id`, `quantity`, `min_stock`, `price`, `supplier`, `status`) VALUES
('MAT001', '不锈钢板', '1.5mm*1220mm*2440mm', '张', '原材料', 1, 100.00, 10.00, 280.00, '宝钢集团', 1),
('MAT002', '铝合金型材', '6061-T6', '根', '原材料', 1, 500.00, 50.00, 45.00, '西南铝业', 1),
('MAT003', '电机外壳', 'YX3-100', '个', '半成品', 2, 200.00, 20.00, 85.00, '自制', 1);
