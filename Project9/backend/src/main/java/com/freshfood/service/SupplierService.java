package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.Supplier;
import com.freshfood.mapper.SupplierMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;

@Service
public class SupplierService extends ServiceImpl<SupplierMapper, Supplier> {

    public Page<Supplier> pageList(Integer pageNum, Integer pageSize, String name) {
        Page<Supplier> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) {
            wrapper.like(Supplier::getName, name);
        }
        wrapper.orderByDesc(Supplier::getCreateTime);
        return this.page(page, wrapper);
    }

    public List<Supplier> listAll() {
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Supplier::getStatus, 1);
        return this.list(wrapper);
    }
}
