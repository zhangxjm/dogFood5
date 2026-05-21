<template>
  <div>
    <h2 style="margin-bottom: 20px">欢迎使用零食批发进销存系统</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 48px; color: #409EFF">{{ stats.suppliers }}</div>
            <div style="color: #909399; margin-top: 10px">供货商数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 48px; color: #67C23A">{{ stats.products }}</div>
            <div style="color: #909399; margin-top: 10px">货品数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 48px; color: #E6A23C">{{ stats.inventoryValue }}</div>
            <div style="color: #909399; margin-top: 10px">库存总值(元)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 48px; color: #F56C6C">{{ stats.orders }}</div>
            <div style="color: #909399; margin-top: 10px">订单数量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>最近入库记录</span>
          </template>
          <el-table :data="recentInLogs" style="width: 100%" size="small">
            <el-table-column prop="Product.name" label="货品名称" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="created_at" label="时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" style="width: 100%" size="small">
            <el-table-column prop="orderNo" label="订单号" width="150" />
            <el-table-column prop="customerName" label="客户名称" />
            <el-table-column prop="totalAmount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" size="small">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supplierApi, productApi, inventoryApi, orderApi } from '../api'

const stats = ref({ suppliers: 0, products: 0, inventoryValue: 0, orders: 0 })
const recentInLogs = ref([])
const recentOrders = ref([])

const getStatusType = (status) => {
  const map = { pending: 'warning', completed: 'success', cancelled: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '待处理', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}

const loadStats = async () => {
  try {
    const [suppliersRes, productsRes, inventoryRes, ordersRes] = await Promise.all([
      supplierApi.getAll(),
      productApi.getAll(),
      inventoryApi.getList({ pageSize: 100 }),
      orderApi.getList({ pageSize: 100 })
    ])
    stats.value.suppliers = suppliersRes.data?.length || 0
    stats.value.products = productsRes.data?.length || 0
    stats.value.orders = ordersRes.data?.total || 0
    let totalValue = 0
    if (inventoryRes.data?.list) {
      inventoryRes.data.list.forEach(item => {
        totalValue += (item.Product?.price || 0) * item.quantity
      })
    }
    stats.value.inventoryValue = totalValue.toFixed(2)
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

const loadRecentLogs = async () => {
  try {
    const res = await inventoryApi.getLogs({ type: 'in', pageSize: 5 })
    recentInLogs.value = res.data?.list || []
  } catch (error) {
    console.error('加载入库记录失败', error)
  }
}

const loadRecentOrders = async () => {
  try {
    const res = await orderApi.getList({ pageSize: 5 })
    recentOrders.value = res.data?.list || []
  } catch (error) {
    console.error('加载订单失败', error)
  }
}

onMounted(() => {
  loadStats()
  loadRecentLogs()
  loadRecentOrders()
})
</script>