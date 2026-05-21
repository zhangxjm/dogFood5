<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>报修申请列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增报修
          </el-button>
        </div>
      </template>
      
      <div style="margin-bottom: 20px">
        <el-select v-model="filterStatus" placeholder="申请状态" style="width: 150px" @change="loadData" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="已派单" value="assigned" />
          <el-option label="维修中" value="repairing" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </div>

      <el-table :data="requests" border stripe>
        <el-table-column prop="request_no" label="申请单号" width="150" />
        <el-table-column prop="device.device_name" label="设备名称" width="150">
          <template #default="{ row }">
            {{ row.device?.device_name }}
          </template>
        </el-table-column>
        <el-table-column prop="fault_type" label="故障类型" width="120" />
        <el-table-column prop="fault_description" label="故障描述" show-overflow-tooltip />
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reporter.real_name" label="报修人" width="100">
          <template #default="{ row }">
            {{ row.reporter?.real_name }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" size="small" type="danger" @click="handleCancel(row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增报修申请" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="选择设备" prop="device_id">
          <el-select v-model="form.device_id" style="width: 100%" placeholder="请选择设备">
            <el-option v-for="device in deviceList" :key="device.id" :label="device.device_name" :value="device.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="故障类型" prop="fault_type">
          <el-select v-model="form.fault_type" style="width: 100%">
            <el-option label="硬件故障" value="硬件故障" />
            <el-option label="软件故障" value="软件故障" />
            <el-option label="网络故障" value="网络故障" />
            <el-option label="其他故障" value="其他故障" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" style="width: 100%">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        <el-form-item label="故障描述" prop="fault_description">
          <el-input v-model="form.fault_description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRepairRequests, createRepairRequest, cancelRepairRequest, getDevices } from '../api'

const requests = ref([])
const deviceList = ref([])
const filterStatus = ref('')
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

const form = reactive({
  device_id: null,
  fault_type: '',
  priority: 'medium',
  fault_description: ''
})

const rules = {
  device_id: [{ required: true, message: '请选择设备', trigger: 'change' }],
  fault_type: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
  fault_description: [{ required: true, message: '请输入故障描述', trigger: 'blur' }]
}

const getPriorityType = (priority) => {
  const types = { low: 'info', medium: '', high: 'warning', urgent: 'danger' }
  return types[priority] || ''
}

const getPriorityText = (priority) => {
  const texts = { low: '低', medium: '中', high: '高', urgent: '紧急' }
  return texts[priority] || priority
}

const getStatusType = (status) => {
  const types = { pending: 'warning', assigned: 'info', repairing: 'primary', completed: 'success', cancelled: 'info' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { pending: '待处理', assigned: '已派单', repairing: '维修中', completed: '已完成', cancelled: '已取消' }
  return texts[status] || status
}

const loadData = async () => {
  try {
    const params = {}
    if (filterStatus.value) params.status = filterStatus.value
    const res = await getRepairRequests(params)
    if (res.data.success) {
      requests.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const loadDevices = async () => {
  try {
    const res = await getDevices()
    if (res.data.success) {
      deviceList.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载设备列表失败')
  }
}

const handleAdd = () => {
  Object.assign(form, {
    device_id: null,
    fault_type: '',
    priority: 'medium',
    fault_description: ''
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await createRepairRequest(form)
    ElMessage.success('报修申请提交成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('提交失败')
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消这条报修申请吗？', '提示', { type: 'warning' })
    await cancelRepairRequest(row.id)
    ElMessage.success('取消成功')
    loadData()
  } catch {
  }
}

onMounted(() => {
  loadData()
  loadDevices()
})
</script>
