CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    uploader_id BIGINT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS circulations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    reader_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    read_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (reader_id) REFERENCES users(id),
    UNIQUE KEY uk_document_reader (document_id, reader_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, name, department) VALUES
('admin', 'System Admin', 'IT Department'),
('zhangsan', 'Zhang San', 'Sales Department'),
('lisi', 'Li Si', 'Engineering Department'),
('wangwu', 'Wang Wu', 'Marketing Department'),
('zhaoliu', 'Zhao Liu', 'HR Department'),
('sunqi', 'Sun Qi', 'Finance Department');

INSERT INTO documents (file_name, file_path, file_size, file_type, uploader_id, description) VALUES
('employee_handbook.pdf', '/uploads/employee_handbook.pdf', 1024000, 'pdf', 1, 'Company Employee Handbook 2024'),
('project_roadmap.docx', '/uploads/project_roadmap.docx', 512000, 'docx', 1, 'Q2 Project Roadmap'),
('quarterly_report.xlsx', '/uploads/quarterly_report.xlsx', 204800, 'xlsx', 1, 'Q1 Financial Report');

INSERT INTO circulations (document_id, reader_id, status, read_at) VALUES
(1, 2, 'READ', '2024-01-15 10:30:00'),
(1, 3, 'READ', '2024-01-16 14:20:00'),
(1, 4, 'PENDING', NULL),
(2, 2, 'READ', '2024-02-20 09:15:00'),
(2, 5, 'PENDING', NULL),
(3, 3, 'PENDING', NULL),
(3, 6, 'READ', '2024-03-10 16:45:00');
