<template>
  <div>
    <el-card>
      <template #header>
        <span>维修记录</span>
      </template>

      <el-table :data="records" border stripe>
        <el-table-column prop="request.request_no" label="申请单号" width="150">
          <template #default="{ row }">
            {{ row.request?.request_no }}
          </template>
        </el-table-column>
        <el-table-column prop="request.device.device_name" label="设备名称" width="150">
          <template #default="{ row }">
            {{ row.request?.device?.device_name }}
          </template>
        </el-table-column>
        <el-table-column prop="technician.real_name" label="维修人员" width="100">
          <template #default="{ row }">
            {{ row.technician?.real_name }}
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" width="180" />
        <el-table-column prop="end_time" label="结束时间" width="180" />
        <el-table-column prop="fault_cause" label="故障原因" show-overflow-tooltip />
        <el-table-column prop="solution" label="解决方案" show-overflow-tooltip />
        <el-table-column prop="cost" label="费用(元)" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'primary'">
              {{ row.status === 'completed' ? '已完成' : '维修中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'processing' && !row.start_time" size="small" type="primary" @click="handleStart(row)">开始维修</el-button>
            <el-button v-if="row.status === 'processing' && row.start_time" size="small" type="success" @click="handleComplete(row)">完成维修</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="完成维修" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="故障原因" prop="fault_cause">
          <el-input v-model="form.fault_cause" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <el-input v-model="form.solution" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="更换配件" prop="parts_used">
          <el-input v-model="form.parts_used" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="费用(元)" prop="cost">
          <el-input-number v-model="form.cost" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getRepairRecords, startRepair, completeRepair } from '../api'

const records = ref([])
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()
const currentRecordId = ref(null)

const form = reactive({
  fault_cause: '',
  solution: '',
  parts_used: '',
  cost: 0
})

const rules = {
  fault_cause: [{ required: true, message: '请输入故障原因', trigger: 'blur' }],
  solution: [{ required: true, message: '请输入解决方案', trigger: 'blur' }]
}

const loadData = async () => {
  try {
    const res = await getRepairRecords()
    if (res.data.success) {
      records.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleStart = async (row) => {
  try {
    await startRepair(row.id)
    ElMessage.success('已开始维修')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleComplete = (row) => {
  currentRecordId.value = row.id
  Object.assign(form, {
    fault_cause: '',
    solution: '',
    parts_used: '',
    cost: 0
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await completeRepair(currentRecordId.value, form)
    ElMessage.success('维修完成')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('操作失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
