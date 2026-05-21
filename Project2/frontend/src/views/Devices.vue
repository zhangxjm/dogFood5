<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>设备列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增设备
          </el-button>
        </div>
      </template>
      
      <div style="margin-bottom: 20px">
        <el-input v-model="searchKeyword" placeholder="搜索设备名称/编号" style="width: 300px" @input="loadData" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="设备状态" style="width: 150px; margin-left: 10px" @change="loadData" clearable>
          <el-option label="正常" value="normal" />
          <el-option label="故障" value="broken" />
          <el-option label="维修中" value="repairing" />
          <el-option label="报废" value="scrapped" />
        </el-select>
      </div>

      <el-table :data="devices" border stripe>
        <el-table-column prop="device_code" label="设备编号" width="120" />
        <el-table-column prop="device_name" label="设备名称" width="150" />
        <el-table-column prop="device_type" label="设备类型" width="120" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="purchase_date" label="购买日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="备注" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑设备' : '新增设备'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="设备编号" prop="device_code">
          <el-input v-model="form.device_code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="设备名称" prop="device_name">
          <el-input v-model="form.device_name" />
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-input v-model="form.device_type" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="购买日期" prop="purchase_date">
          <el-date-picker v-model="form.purchase_date" type="date" style="width: 100%" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="故障" value="broken" />
            <el-option label="维修中" value="repairing" />
            <el-option label="报废" value="scrapped" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDevices, createDevice, updateDevice, deleteDevice } from '../api'

const devices = ref([])
const searchKeyword = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)
const formRef = ref()

const form = reactive({
  id: null,
  device_code: '',
  device_name: '',
  device_type: '',
  location: '',
  purchase_date: '',
  status: 'normal',
  description: ''
})

const rules = {
  device_code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  device_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  device_type: [{ required: true, message: '请输入设备类型', trigger: 'blur' }]
}

const getStatusType = (status) => {
  const types = { normal: 'success', broken: 'danger', repairing: 'warning', scrapped: 'info' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { normal: '正常', broken: '故障', repairing: '维修中', scrapped: '报废' }
  return texts[status] || status
}

const loadData = async () => {
  try {
    const params = {}
    if (searchKeyword.value) params.search = searchKeyword.value
    if (filterStatus.value) params.status = filterStatus.value
    const res = await getDevices(params)
    if (res.data.success) {
      devices.value = res.data.data
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    device_code: '',
    device_name: '',
    device_type: '',
    location: '',
    purchase_date: '',
    status: 'normal',
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    if (isEdit.value) {
      await updateDevice(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createDevice(form)
      ElMessage.success('添加成功')
    }
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

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除设备「${row.device_name}」吗？`, '提示', {
      type: 'warning'
    })
    await deleteDevice(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
  }
}

onMounted(() => {
  loadData()
})
</script>
