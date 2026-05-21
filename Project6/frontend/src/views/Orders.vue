<template>
    <div class="orders">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>订单管理</span>
                </div>
            </template>

            <el-form :inline="true" :model="filters" class="filter-form">
                <el-form-item label="状态">
                    <el-select v-model="filters.status" placeholder="请选择" clearable style="width: 200px">
                        <el-option label="待处理" value="pending" />
                        <el-option label="已确认" value="confirmed" />
                        <el-option label="已发货" value="shipped" />
                        <el-option label="已完成" value="completed" />
                        <el-option label="已取消" value="cancelled" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadOrders">查询</el-button>
                    <el-button @click="resetFilters">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="orders" border stripe>
                <el-table-column prop="order_no" label="订单号" width="180" />
                <el-table-column prop="customer.name" label="客户" />
                <el-table-column prop="total_amount" label="金额" width="100">
                    <template #default="{ row }">¥{{ row.total_amount }}</template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">
                            {{ getStatusText(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="receiver_name" label="收货人" />
                <el-table-column prop="phone" label="电话" width="120" />
                <el-table-column prop="address" label="地址" show-overflow-tooltip />
                <el-table-column prop="created_at" label="下单时间" width="180" />
                <el-table-column label="操作" width="280">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
                        <el-dropdown @command="(status) => updateStatus(row, status)" v-if="row.status !== 'completed' && row.status !== 'cancelled'">
                            <el-button link type="primary">状态流转<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="confirmed" v-if="row.status === 'pending'">确认订单</el-dropdown-item>
                                    <el-dropdown-item command="shipped" v-if="row.status === 'confirmed'">发货</el-dropdown-item>
                                    <el-dropdown-item command="completed" v-if="row.status === 'shipped'">完成</el-dropdown-item>
                                    <el-dropdown-item command="cancelled">取消订单</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="detailVisible" title="订单详情" width="700px">
            <div v-if="currentOrder">
                <el-descriptions :column="2" border size="small">
                    <el-descriptions-item label="订单号">{{ currentOrder.order_no }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="getStatusType(currentOrder.status)">
                            {{ getStatusText(currentOrder.status) }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="客户">{{ currentOrder.customer?.name }}</el-descriptions-item>
                    <el-descriptions-item label="电话">{{ currentOrder.phone }}</el-descriptions-item>
                    <el-descriptions-item label="收货人">{{ currentOrder.receiver_name }}</el-descriptions-item>
                    <el-descriptions-item label="金额">¥{{ currentOrder.total_amount }}</el-descriptions-item>
                    <el-descriptions-item label="地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
                    <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
                </el-descriptions>

                <el-divider>商品明细</el-divider>
                <el-table :data="currentOrder.order_items" size="small" border>
                    <el-table-column prop="product_name" label="商品" />
                    <el-table-column prop="price" label="单价">
                        <template #default="{ row }">¥{{ row.price }}</template>
                    </el-table-column>
                    <el-table-column prop="quantity" label="数量" />
                    <el-table-column prop="subtotal" label="小计">
                        <template #default="{ row }">¥{{ row.subtotal }}</template>
                    </el-table-column>
                </el-table>

                <el-divider>状态流转记录</el-divider>
                <el-timeline>
                    <el-timeline-item
                        v-for="log in statusLogs"
                        :key="log.id"
                        :timestamp="log.created_at"
                    >
                        {{ getStatusText(log.new_status) }}
                        <span v-if="log.remark"> - {{ log.remark }}</span>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '../api'

const orders = ref([])
const detailVisible = ref(false)
const currentOrder = ref(null)
const statusLogs = ref([])

const filters = reactive({
    status: ''
})

const statusMap = {
    pending: { text: '待处理', type: 'warning' },
    confirmed: { text: '已确认', type: 'primary' },
    shipped: { text: '已发货', type: 'info' },
    completed: { text: '已完成', type: 'success' },
    cancelled: { text: '已取消', type: 'danger' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'info'

const loadOrders = async () => {
    try {
        const res = await orderApi.list(filters)
        orders.value = res.data
    } catch (error) {
        ElMessage.error('加载订单列表失败')
    }
}

const resetFilters = () => {
    filters.status = ''
    loadOrders()
}

const viewDetail = async (row) => {
    try {
        const [orderRes, logsRes] = await Promise.all([
            orderApi.get(row.id),
            orderApi.logs(row.id)
        ])
        currentOrder.value = orderRes.data
        statusLogs.value = logsRes.data
        detailVisible.value = true
    } catch (error) {
        ElMessage.error('加载订单详情失败')
    }
}

const updateStatus = async (row, status) => {
    try {
        await ElMessageBox.confirm(`确定要将订单状态更新为"${getStatusText(status)}"吗？`, '提示', {
            type: 'warning'
        })
        await orderApi.updateStatus(row.id, { status })
        ElMessage.success('状态更新成功')
        loadOrders()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('状态更新失败')
        }
    }
}

onMounted(() => {
    loadOrders()
})
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.filter-form {
    margin-bottom: 20px;
}
</style>
