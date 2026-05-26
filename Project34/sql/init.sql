CREATE DATABASE IF NOT EXISTS warehouse_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE warehouse_db;

-- Warehouse areas table
CREATE TABLE IF NOT EXISTS warehouse_area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'area name',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'area code',
    description VARCHAR(500) COMMENT 'area description',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='warehouse area table';

-- Materials table
CREATE TABLE IF NOT EXISTS material (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'material code',
    name VARCHAR(100) NOT NULL COMMENT 'material name',
    category VARCHAR(100) COMMENT 'material category',
    unit VARCHAR(20) COMMENT 'unit of measurement',
    warehouse_area_id INT COMMENT 'warehouse area id',
    stock INT DEFAULT 0 COMMENT 'current stock quantity',
    description VARCHAR(500) COMMENT 'material description',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_warehouse_area_id (warehouse_area_id),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='materials table';

-- Material transaction records table
CREATE TABLE IF NOT EXISTS material_record (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL COMMENT 'material id',
    material_code VARCHAR(50) COMMENT 'material code snapshot',
    material_name VARCHAR(100) COMMENT 'material name snapshot',
    type VARCHAR(20) NOT NULL COMMENT 'transaction type: in or out',
    quantity INT NOT NULL COMMENT 'quantity',
    operator VARCHAR(100) COMMENT 'operator name',
    remark VARCHAR(500) COMMENT 'remark',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_material_id (material_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='material transaction records';

-- Initial warehouse areas
INSERT INTO warehouse_area (name, code, description) VALUES
('Main Warehouse Area A', 'A001', 'Main storage area for general materials'),
('Main Warehouse Area B', 'A002', 'Storage area for large items'),
('Climate Controlled Area', 'A003', 'Temperature and humidity controlled area'),
('Hazardous Materials Area', 'A004', 'Storage for hazardous and flammable materials'),
('Temporary Storage Area', 'A005', 'Temporary storage for incoming materials')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial materials
INSERT INTO material (code, name, category, unit, warehouse_area_id, stock, description) VALUES
('MAT001', 'Carbon Steel Pipe', 'Metal Materials', 'meter', 1, 500, 'Standard carbon steel pipe for structural use'),
('MAT002', 'Aluminum Alloy Sheet', 'Metal Materials', 'sheet', 1, 200, '5mm thick aluminum alloy sheet'),
('MAT003', 'Rubber Gasket', 'Sealing Materials', 'piece', 2, 1000, 'Industrial rubber sealing gasket'),
('MAT004', 'Copper Wire', 'Electrical Materials', 'meter', 1, 300, '2.5mm copper electrical wire'),
('MAT005', 'LED Light Strip', 'Electrical Materials', 'meter', 2, 150, 'Waterproof LED light strip'),
('MAT006', 'Chemical Solvent', 'Chemical Materials', 'liter', 4, 50, 'Industrial cleaning solvent'),
('MAT007', 'Precision Bearing', 'Mechanical Parts', 'piece', 3, 80, 'High precision industrial bearing'),
('MAT008', 'Hydraulic Oil', 'Lubricants', 'liter', 4, 120, 'Industrial grade hydraulic oil')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial transaction records
INSERT INTO material_record (material_id, material_code, material_name, type, quantity, operator, remark) VALUES
(1, 'MAT001', 'Carbon Steel Pipe', 'in', 500, 'System', 'Initial stock entry'),
(2, 'MAT002', 'Aluminum Alloy Sheet', 'in', 200, 'System', 'Initial stock entry'),
(3, 'MAT003', 'Rubber Gasket', 'in', 1000, 'System', 'Initial stock entry'),
(4, 'MAT004', 'Copper Wire', 'in', 300, 'System', 'Initial stock entry'),
(5, 'MAT005', 'LED Light Strip', 'in', 150, 'System', 'Initial stock entry'),
(6, 'MAT006', 'Chemical Solvent', 'in', 50, 'System', 'Initial stock entry'),
(7, 'MAT007', 'Precision Bearing', 'in', 80, 'System', 'Initial stock entry'),
(8, 'MAT008', 'Hydraulic Oil', 'in', 120, 'System', 'Initial stock entry');
