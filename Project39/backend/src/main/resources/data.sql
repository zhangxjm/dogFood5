-- Insert categories
INSERT INTO t_category (name, description, image_url, price, unit, harvest_season, start_date, end_date, active, sort_order) VALUES
('Strawberry', 'Sweet and juicy strawberries, perfect for family picking', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 39.90, 'pound', 'Spring', '2026-03-01', '2026-05-31', true, 1),
('Blueberry', 'Fresh organic blueberries rich in antioxidants', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', 59.90, 'pound', 'Summer', '2026-06-01', '2026-08-15', true, 2),
('Watermelon', 'Crisp and sweet watermelons, great for summer', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', 29.90, 'piece', 'Summer', '2026-06-15', '2026-08-31', true, 3),
('Grape', 'Seedless grapes, sweet and refreshing', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400', 45.90, 'pound', 'Autumn', '2026-08-20', '2026-10-15', true, 4),
('Apple', 'Crisp and sweet Fuji apples', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 19.90, 'pound', 'Autumn', '2026-09-15', '2026-11-30', true, 5),
('Persimmon', 'Sweet and soft persimmons, full of flavor', 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400', 25.90, 'pound', 'Autumn', '2026-10-01', '2026-11-20', true, 6);

-- Insert time slots for today and next 6 days
-- Day 1 (Today)
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(CURDATE(), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(CURDATE(), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(CURDATE(), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(CURDATE(), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 2
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 3
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 2 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 4
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 5
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 6
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 5 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);

-- Day 7
INSERT INTO t_time_slot (date, start_time, end_time, max_capacity, booked_count, active, price) VALUES
(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '08:00:00', '10:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', '12:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '13:00:00', '15:00:00', 50, 0, true, 20.00),
(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '15:00:00', '17:00:00', 50, 0, true, 20.00);
