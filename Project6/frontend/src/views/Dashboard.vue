<template>
    <div class="dashboard">
        <el-row :gutter="20" class="stats-row">
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon order-icon">
                            <el-icon><Document /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ stats.total_orders || 0 }}</div>
                            <div class="stat-label">总订单数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon revenue-icon">
                            <el-icon><Money /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">¥{{ stats.total_revenue || 0 }}</div>
                            <div class="stat-label">总收入</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon product-icon">
                            <el-icon><Goods /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ stats.total_products || 0 }}</div>
                            <div class="stat-label">商品数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card">
                    <div class="stat-content">
                        <div class="stat-icon customer-icon">
                            <el-icon><User /></el-icon>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ stats.total_customers || 0 }}</div>
                            <div class="stat-label">客户数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="today-row">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <span>今日数据</span>
                    </template>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="今日订单">{{ stats.today_orders || 0 }}</el-descriptions-item>
                        <el-descriptions-item label="今日收入">¥{{ stats.today_revenue || 0 }}</el-descriptions-item>
                        <el-descriptions-item label="待处理订单">{{ stats.pending_orders || 0 }}</el-descriptions-item>
                    </el-descriptions>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <span>热销商品</span>
                    </template>
                    <el-table :data="topProducts" size="small">
                        <el-table-column prop="name" label="商品名称" />
                        <el-table-column prop="quantity" label="销量" />
                        <el-table-column prop="total" label="销售额">
                            <template #default="{ row }">¥{{ row.total }}</template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" class="chart-row">
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <span>销售额趋势</span>
                    </template>
                    <div ref="salesChartRef" class="chart"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <template #header>
                        <span>分类销售占比</span>
                    </template>
                    <div ref="categoryChartRef" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { statsApi } from '../api'
import * as echarts from 'echarts'

const stats = ref({})
const topProducts = ref([])
const salesChartRef = ref(null)
const categoryChartRef = ref(null)

let salesChart = null
let categoryChart = null

const loadData = async () => {
    try {
        const [dashboardRes, topRes, dateRes, categoryRes] = await Promise.all([
            statsApi.dashboard(),
            statsApi.topProducts({ limit: 5 }),
            statsApi.salesByDate({ days: 7 }),
            statsApi.salesByCategory()
        ])

        stats.value = dashboardRes.data
        topProducts.value = topRes.data

        nextTick(() => {
            initSalesChart(dateRes.data)
            initCategoryChart(categoryRes.data)
        })
    } catch (error) {
        ElMessage.error('加载数据失败')
    }
}

const initSalesChart = (data) => {
    if (salesChartRef.value) {
        salesChart = echarts.init(salesChartRef.value)
        salesChart.setOption({
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: data.map(item => item.date)
            },
            yAxis: { type: 'value' },
            series: [{
                data: data.map(item => item.total),
                type: 'line',
                smooth: true,
                areaStyle: { opacity: 0.3 }
            }]
        })
    }
}

const initCategoryChart = (data) => {
    if (categoryChartRef.value) {
        categoryChart = echarts.init(categoryChartRef.value)
        categoryChart.setOption({
            tooltip: { trigger: 'item' },
            legend: { bottom: '5%' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: data.map(item => ({ name: item.Category, value: item.total }))
            }]
        })
    }
}

onMounted(() => {
    loadData()
    window.addEventListener('resize', () => {
        salesChart?.resize()
        categoryChart?.resize()
    })
})
</script>

<style scoped>
.dashboard {
    padding: 0;
}
.stats-row {
    margin-bottom: 20px;
}
.stat-card {
    height: 100px;
}
.stat-content {
    display: flex;
    align-items: center;
    gap: 15px;
}
.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #fff;
}
.order-icon { background: #409EFF; }
.revenue-icon { background: #67C23A; }
.product-icon { background: #E6A23C; }
.customer-icon { background: #F56C6C; }
.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
}
.stat-label {
    font-size: 14px;
    color: #909399;
}
.today-row, .chart-row {
    margin-bottom: 20px;
}
.chart {
    height: 300px;
}
</style>
