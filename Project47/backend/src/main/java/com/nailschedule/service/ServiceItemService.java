package com.nailschedule.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nailschedule.entity.ServiceItem;
import com.nailschedule.mapper.ServiceItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceItemService {

    @Autowired
    private ServiceItemMapper serviceItemMapper;

    public List<ServiceItem> list() {
        return serviceItemMapper.selectList(
                new LambdaQueryWrapper<ServiceItem>().orderByDesc(ServiceItem::getCreateTime));
    }

    public List<ServiceItem> listActive() {
        return serviceItemMapper.selectList(
                new LambdaQueryWrapper<ServiceItem>().eq(ServiceItem::getStatus, 1));
    }

    public ServiceItem save(ServiceItem serviceItem) {
        if (serviceItem.getId() == null) {
            serviceItemMapper.insert(serviceItem);
        } else {
            serviceItemMapper.updateById(serviceItem);
        }
        return serviceItem;
    }

    public void delete(Long id) {
        serviceItemMapper.deleteById(id);
    }
}
