CREATE TABLE IF NOT EXISTS `time_slot` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `date` date NOT NULL COMMENT '日期',
  `start_time` time NOT NULL COMMENT '开始时间',
  `end_time` time NOT NULL COMMENT '结束时间',
  `max_people` int NOT NULL DEFAULT 50 COMMENT '最大人数',
  `reserved_people` int NOT NULL DEFAULT 0 COMMENT '已预约人数',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 0-关闭 1-开启',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_date_time` (`date`,`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入园时段表';

CREATE TABLE IF NOT EXISTS `reservation` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `reservation_no` varchar(32) NOT NULL COMMENT '预约单号',
  `time_slot_id` bigint NOT NULL COMMENT '时段ID',
  `visitor_name` varchar(50) NOT NULL COMMENT '游客姓名',
  `visitor_phone` varchar(20) NOT NULL COMMENT '游客手机号',
  `people_count` int NOT NULL COMMENT '人数',
  `id_card` varchar(18) COMMENT '身份证号',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态 0-待核销 1-已核销 2-已取消',
  `checkin_time` datetime COMMENT '核销时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reservation_no` (`reservation_no`),
  KEY `idx_phone` (`visitor_phone`),
  KEY `idx_time_slot_id` (`time_slot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约记录表';

CREATE TABLE IF NOT EXISTS `category` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) NOT NULL COMMENT '品类名称',
  `description` varchar(500) COMMENT '品类描述',
  `image` varchar(255) COMMENT '图片URL',
  `season` varchar(50) COMMENT '成熟季节',
  `price` decimal(10,2) COMMENT '参考价格',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态 0-下架 1-上架',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采摘品类表';

INSERT INTO `category` (`name`, `description`, `image`, `season`, `price`, `sort`) VALUES
('草莓', '新鲜有机草莓，口感香甜多汁，富含维生素C', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca?w=400', '12月-5月', 35.00, 1),
('蓝莓', '高山蓝莓，颗粒饱满，花青素含量高', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', '5月-8月', 60.00, 2),
('樱桃', '红灯笼大樱桃，果肉肥厚，甜酸适口', 'https://images.unsplash.com/photo-1528821128474-021596934931?w=400', '5月-6月', 50.00, 3),
('葡萄', '阳光玫瑰葡萄，香气浓郁，甜度高', 'https://images.unsplash.com/photo-1537637912654-2f161045b8b9?w=400', '7月-10月', 40.00, 4),
('桃子', '水蜜桃，果肉柔软多汁，香气扑鼻', 'https://images.unsplash.com/photo-1566662895076-4acc48adae7c?w=400', '6月-8月', 25.00, 5),
('苹果', '红富士苹果，脆甜爽口，耐储存', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', '10月-12月', 15.00, 6);

INSERT INTO `time_slot` (`date`, `start_time`, `end_time`, `max_people`, `reserved_people`, `status`) VALUES
(CURDATE(), '08:00:00', '10:00:00', 50, 0, 1),
(CURDATE(), '10:00:00', '12:00:00', 50, 0, 1),
(CURDATE(), '14:00:00', '16:00:00', 50, 0, 1),
(CURDATE(), '16:00:00', '18:00:00', 50, 0, 1);
