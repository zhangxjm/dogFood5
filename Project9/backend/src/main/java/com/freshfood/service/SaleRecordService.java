package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.Product;
import com.freshfood.entity.SaleRecord;
import com.freshfood.mapper.ProductMapper;
import com.freshfood.mapper.SaleRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SaleRecordService extends ServiceImpl<SaleRecordMapper, SaleRecord> {

    @Autowired
    private ProductMapper productMapper;

    public List<Map<String, Object>> getUnsalableProducts(Integer days, Integer minQuantity) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        LambdaQueryWrapper<Product> productWrapper = new LambdaQueryWrapper<>();
        productWrapper.eq(Product::getStatus, 1);
        List<Product> products = productMapper.selectList(productWrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Product product : products) {
            LambdaQueryWrapper<SaleRecord> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(SaleRecord::getProductId, product.getId());
            wrapper.ge(SaleRecord::getSaleDate, startDate);
            List<SaleRecord> records = this.list(wrapper);
            int totalQuantity = records.stream().mapToInt(SaleRecord::getQuantity).sum();
            if (totalQuantity <= minQuantity) {
                Map<String, Object> map = new HashMap<>();
                map.put("productId", product.getId());
                map.put("productName", product.getName());
                map.put("saleQuantity", totalQuantity);
                map.put("price", product.getPrice());
                result.add(map);
            }
        }
        return result;
    }

    public Map<String, Object> getDashboardData() {
        Map<String, Object> result = new HashMap<>();
        List<SaleRecord> allRecords = this.list();
        int totalSaleQuantity = allRecords.stream().mapToInt(SaleRecord::getQuantity).sum();
        double totalSaleAmount = allRecords.stream()
                .mapToDouble(r -> r.getTotalAmount() != null ? r.getTotalAmount().doubleValue() : 0)
                .sum();
        result.put("totalSaleQuantity", totalSaleQuantity);
        result.put("totalSaleAmount", totalSaleAmount);
        List<Map<String, Object>> unsalableProducts = getUnsalableProducts(30, 10);
        result.put("unsalableCount", unsalableProducts.size());
        return result;
    }
}
