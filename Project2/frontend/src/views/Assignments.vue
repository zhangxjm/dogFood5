<template>
  <div>
    <el-card>
      <template #header>
        <span>派单管理</span>
      </template>

      <el-table :data="requests" border stripe>
        <el-table-column prop="request_no" label="申请单号" width="150" />
        <el-table-column prop="device.device_name" label="设备名称" width="150">
          <template #default="{ row }">
            {{ row.device?.device_name }}
          </template>
        </el-table-column>
        <el-table-column prop="fault_type" label="故障类型" width="120" />
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
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" size="small" type="primary" @click="handleAssign(row)">派单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="派单" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="选择维修人员" prop="technician_id">
          <el-select v-model="form.technician_id" style="width: 100%" placeholder="请选择维修人员">
            <el-option v-for="tech in technicians" :key="tech.id" :label="tech.real_name" :value="tech.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定派单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRepairRequests, getTechnicians, createAssignment } from '../api'

const requests = ref([])
const technicians = ref([])
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

const form = reactive({
  request_id: null,
  technician_id: null,
  remark: ''
})

const rules = {
  technician_id: [{ required: true, message: '请选择维修人员', trigger: 'change' }]
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
    const res = await getRepairRequests({ status: 'pending' })
    if (res.data.success) {
      requests.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const loadTechnicians = async () => {
  try {
    const res = await getTechnicians()
    if (res.data.success) {
      technicians.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载维修人员列表失败')
  }
}

const handleAssign = (row) => {
  form.request_id = row.id
  form.technician_id = null
  form.remark = ''
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await createAssignment(form)
    ElMessage.success('派单成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('派单失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  loadTechnicians()
})
</script>
