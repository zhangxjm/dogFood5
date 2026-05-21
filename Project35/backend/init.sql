CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50),
  image VARCHAR(255),
  status TINYINT DEFAULT 1 COMMENT '1:上架 0:下架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  customer_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  status TINYINT DEFAULT 0 COMMENT '0:待确认 1:已确认 2:进行中 3:已完成 4:已取消',
  remark TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO services (name, description, price, duration, image) VALUES
('绿植日常养护', '包括浇水、施肥、修剪、清洁叶片等基础养护服务', 99.00, '1-2小时', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'),
('绿植病虫害防治', '专业防治绿植病虫害，使用环保药剂', 149.00, '1小时', 'https://images.unsplash.com/photo-1416879595882-3373803ce858?w=400'),
('绿植换盆服务', '专业换盆、配土、根系修剪', 79.00, '30分钟', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'),
('大型绿植搬运', '专业搬运大型绿植，安全稳妥', 199.00, '2-3小时', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400'),
('绿植租赁养护包月', '每月4次上门养护服务', 299.00, '包月服务', 'https://images.unsplash.com/photo-1518531939711-c501d59373048?w=400');
