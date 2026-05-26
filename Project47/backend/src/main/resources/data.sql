USE nail_schedule;

INSERT IGNORE INTO technician (id, name, phone, specialty, status) VALUES
(1, 'Xiao Mei', '13800138001', 'Nail Art, Gel Nails', 1),
(2, 'Xiao Hong', '13800138002', 'Manicure, Pedicure', 1),
(3, 'Xiao Fang', '13800138003', 'Nail Extension, Nail Painting', 1),
(4, 'Xiao Li', '13800138004', 'Japanese Style Nails', 1),
(5, 'Xiao Juan', '13800138005', 'Korean Style Nails, Nail Care', 1);

INSERT IGNORE INTO service_item (id, name, description, duration, price, status) VALUES
(1, 'Basic Manicure', 'Basic nail trimming and polishing', 30, 68.00, 1),
(2, 'Gel Nails', 'Long-lasting gel nail polish', 60, 128.00, 1),
(3, 'Nail Art', 'Creative nail art design', 90, 188.00, 1),
(4, 'Nail Extension', 'Extend nail length with acrylic', 120, 288.00, 1),
(5, 'Pedicure', 'Foot nail care and polishing', 60, 158.00, 1),
(6, 'Nail Care', 'Professional nail care treatment', 45, 98.00, 1);

INSERT IGNORE INTO schedule (id, technician_id, schedule_date, start_time, end_time, shift_type) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '09:00:00', '18:00:00', 'FULL'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '09:00:00', '14:00:00', 'MORNING'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '14:00:00', '21:00:00', 'NIGHT'),
(4, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '18:00:00', 'FULL'),
(5, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '14:00:00', 'MORNING'),
(6, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '21:00:00', 'NIGHT'),
(7, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '18:00:00', 'FULL'),
(8, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '14:00:00', 'MORNING'),
(9, 4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '21:00:00', 'NIGHT');

INSERT IGNORE INTO appointment (id, customer_name, customer_phone, technician_id, appointment_date, appointment_time, service_type, status, remark) VALUES
(1, 'Customer A', '13900139001', 1, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '10:00:00', 'Gel Nails', 2, 'Prefer light color'),
(2, 'Customer B', '13900139002', 2, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '11:00:00', 'Basic Manicure', 1, ''),
(3, 'Customer C', '13900139003', 3, DATE_ADD(CURDATE(), INTERVAL 0 DAY), '15:00:00', 'Nail Art', 1, 'Floral design'),
(4, 'Customer D', '13900139004', 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:30:00', 'Nail Extension', 1, ''),
(5, 'Customer E', '13900139005', 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 'Pedicure', 1, ''),
(6, 'Customer F', '13900139006', 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:30:00', 'Nail Care', 1, 'Sensitive nails');
