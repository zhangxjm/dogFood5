<template>
  <div class="page-container">
    <div class="page-header">
      <h2>搬家完成记录</h2>
      <el-button type="primary" @click="showDialog = true">
        <el-icon><Plus /></el-icon>
        新增记录
      </el-button>
    </div>

    <div class="card-container">
      <el-table :data="records" stripe v-loading="loading">
        <el-table-column prop="id" label="记录ID" width="80" />
        <el-table-column label="客户姓名" width="120">
          <template #default="{ row }">
            {{ row.request?.customerName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="140">
          <template #default="{ row }">
            {{ row.request?.phone || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="使用车型" width="120">
          <template #default="{ row }">
            {{ row.vehicle?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="实际距离" width="110">
          <template #default="{ row }">
            {{ row.actualDistance }} km
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="120">
          <template #default="{ row }">
            <span style="color: #f59e0b; font-weight: bold;">¥{{ row.totalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="100">
          <template #default="{ row }">
            <span :class="['status-tag', `payment-${row.paymentStatus}`]">
              {{ getPaymentStatusText(row.paymentStatus) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.actualStartTime) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.actualEndTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </div>

    <el-dialog v-model="showDialog" title="新增搬家完成记录" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="选择需求" prop="requestId">
          <el-select v-model="form.requestId" placeholder="请选择需求" filterable style="width: 100%;">
            <el-option
              v-for="req in pendingRequests"
              :key="req.id"
              :label="`${req.customerName} - ${req.moveFrom} → ${req.moveTo}`"
              :value="req.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用车型" prop="vehicleId">
          <el-select v-model="form.vehicleId" placeholder="请选择车型" style="width: 100%;">
            <el-option
              v-for="v in vehicles"
              :key="v.id"
              :label="`${v.name} - ¥${v.basePrice}起`"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="actualStartTime">
              <el-date-picker
                v-model="form.actualStartTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="actualEndTime">
              <el-date-picker
                v-model="form.actualEndTime"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="实际距离(km)" prop="actualDistance">
          <el-input-number v-model="form.actualDistance" :min="0" :precision="1" :step="0.5" />
        </el-form-item>
        <el-form-item label="总金额(¥)" prop="totalAmount">
          <el-input-number v-model="form.totalAmount" :min="0" :precision="2" :step="10" />
        </el-form-item>
        <el-form-item label="付款状态" prop="paymentStatus">
          <el-select v-model="form.paymentStatus" style="width: 100%;">
            <el-option label="未付款" value="unpaid" />
            <el-option label="已付款" value="paid" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMoveRecords, createMoveRecord, getMoveRequests, getVehicles } from '../api'

const loading = ref(false)
const records = ref([])
const pendingRequests = ref([])
const vehicles = ref([])
const showDialog = ref(false)
const formRef = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const form = reactive({
  requestId: null,
  vehicleId: null,
  actualStartTime: new Date(),
  actualEndTime: new Date(),
  actualDistance: 0,
  totalAmount: 0,
  paymentStatus: 'unpaid',
  remarks: ''
})

const rules = {
  requestId: [{ required: true, message: '请选择需求', trigger: 'change' }],
  vehicleId: [{ required: true, message: '请选择车型', trigger: 'change' }],
  actualStartTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  actualEndTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  totalAmount: [{ required: true, message: '请输入总金额', trigger: 'blur' }]
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const getPaymentStatusText = (status) => {
  const map = {
    unpaid: '未付款',
    paid: '已付款',
    refunded: '已退款'
  }
  return map[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const [recordsRes, requestsRes, vehiclesRes] = await Promise.all([
      getMoveRecords({ page: pagination.page, pageSize: pagination.pageSize }),
      getMoveRequests({ status: 'pending', pageSize: 100 }),
      getVehicles()
    ])
    records.value = recordsRes.data.list || []
    pagination.total = recordsRes.data.total || 0
    pendingRequests.value = requestsRes.data.list || []
    vehicles.value = vehiclesRes.data || []
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.requestId = null
  form.vehicleId = null
  form.actualStartTime = new Date()
  form.actualEndTime = new Date()
  form.actualDistance = 0
  form.totalAmount = 0
  form.paymentStatus = 'unpaid'
  form.remarks = ''
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    await createMoveRecord(form)
    ElMessage.success('创建成功')
    showDialog.value = false
    resetForm()
    loadData()
  } catch (error) {
    if (error !== false) {
      console.error('Failed to submit:', error)
    }
  }
}

onMounted(loadData)
</script>

<style scoped>
.card-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
