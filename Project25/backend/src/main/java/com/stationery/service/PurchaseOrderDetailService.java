package com.stationery.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.PurchaseOrderDetail;
import com.stationery.mapper.PurchaseOrderDetailMapper;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderDetailService extends ServiceImpl<PurchaseOrderDetailMapper, PurchaseOrderDetail> {
}
