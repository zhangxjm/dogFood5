INSERT INTO stall_category (name, description, unit_price, is_active, create_time, update_time) VALUES
('Jian Bing', 'Chinese crepe with egg and crispy fritter', 8.00, 1, NOW(), NOW()),
('Shao Kao', 'BBQ skewers with various meats and veggies', 3.00, 1, NOW(), NOW()),
('Xiaolongbao', 'Steamed soup dumplings with pork filling', 15.00, 1, NOW(), NOW()),
('Stinky Tofu', 'Fermented tofu with special sauce', 10.00, 1, NOW(), NOW()),
('Roujiamo', 'Chinese hamburger with braised pork', 12.00, 1, NOW(), NOW()),
('Cold Noodles', 'Refreshing cold noodles with sesame sauce', 8.00, 1, NOW(), NOW()),
('Oyster Omelet', 'Oyster and egg omelet with sweet sauce', 20.00, 1, NOW(), NOW()),
('Spicy Crayfish', 'Spicy boiled crayfish with chili', 38.00, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;
