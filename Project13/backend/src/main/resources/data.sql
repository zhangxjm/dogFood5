-- 插入饮品数据（仅当表为空时插入）
INSERT INTO drink (name, description, price, image, category, available, create_time, update_time) 
SELECT * FROM (
    SELECT '珍珠奶茶' AS name, '经典珍珠奶茶，Q弹珍珠，香浓奶味' AS description, 12.00 AS price, NULL AS image, 1 AS category, b'1' AS available, NOW() AS create_time, NOW() AS update_time UNION ALL
    SELECT '芋泥啵啵奶绿', '香浓芋泥搭配啵啵，清新绿茶底', 15.00, NULL, 1, b'1', NOW(), NOW() UNION ALL
    SELECT '焦糖布丁奶茶', '丝滑布丁配焦糖，甜而不腻', 14.00, NULL, 1, b'1', NOW(), NOW() UNION ALL
    SELECT '杨枝甘露', '芒果西柚椰奶组合，港式经典', 18.00, NULL, 2, b'1', NOW(), NOW() UNION ALL
    SELECT '芝芝莓莓', '新鲜草莓搭配芝士奶盖，酸甜可口', 16.00, NULL, 2, b'1', NOW(), NOW() UNION ALL
    SELECT '满杯水果茶', '多种新鲜水果，维C满满', 15.00, NULL, 2, b'1', NOW(), NOW() UNION ALL
    SELECT '柠檬茶', '清新柠檬红茶，解暑佳品', 10.00, NULL, 3, b'1', NOW(), NOW() UNION ALL
    SELECT '美式咖啡', '经典美式，提神醒脑', 12.00, NULL, 3, b'1', NOW(), NOW() UNION ALL
    SELECT '抹茶拿铁', '日式抹茶配香浓牛奶', 16.00, NULL, 3, b'1', NOW(), NOW() UNION ALL
    SELECT '双人套餐A', '珍珠奶茶2杯+薯条，情侣首选', 35.00, NULL, 4, b'1', NOW(), NOW() UNION ALL
    SELECT '家庭套餐', '4杯饮品+小食拼盘，家庭聚会必备', 88.00, NULL, 4, b'1', NOW(), NOW() UNION ALL
    SELECT '下午茶套餐', '2杯饮品+2份甜点，悠闲时光', 48.00, NULL, 4, b'1', NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM drink LIMIT 1);
