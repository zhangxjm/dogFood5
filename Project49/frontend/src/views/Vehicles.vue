<template>
  <div class="page-container">
    <div class="page-header">
      <h2>车型管理</h2>
      <el-button type="primary" @click="showDialog = true">
        <el-icon><Plus /></el-icon>
        新增车型
      </el-button>
    </div>

    <div class="card-container">
      <el-table :data="vehicles" stripe v-loading="loading">
        <el-table-column prop="name" label="车型名称" width="120" />
        <el-table-column prop="size" label="车辆尺寸" width="150" />
        <el-table-column prop="capacity" label="载重容量" width="120" />
        <el-table-column prop="basePrice" label="基础价格" width="100">
          <template #default="{ row }">
            ¥{{ row.basePrice }}
          </template>
        </el-table-column>
        <el-table-column prop="pricePerKm" label="每公里价格" width="120">
          <template #default="{ row }">
            ¥{{ row.pricePerKm }}
          </template>
        </el-table-column>
        <el-table-column prop="floorPrice" label="每层加价" width="100">
          <template #default="{ row }">
            ¥{{ row.floorPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.isActive ? 'danger' : 'success'" link @click="handleToggle(row)">
              {{ row.isActive ? '停用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="showDialog" :title="isEdit ? '编辑车型' : '新增车型'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="车型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入车型名称" />
        </el-form-item>
        <el-form-item label="车辆尺寸" prop="size">
          <el-input v-model="form.size" placeholder="例如: 2.5×1.5×1.5米" />
        </el-form-item>
        <el-form-item label="载重容量">
          <el-input v-model="form.capacity" placeholder="例如: 500kg" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基础价格" prop="basePrice">
              <el-input-number v-model="form.basePrice" :min="0" :precision="2" :step="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每公里价格" prop="pricePerKm">
              <el-input-number v-model="form.pricePerKm" :min="0" :precision="2" :step="0.5" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="每层加价">
          <el-input-number v-model="form.floorPrice" :min="0" :precision="2" :step="5" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入车型描述" />
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
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api'

const loading = ref(false)
const vehicles = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = reactive({
  id: null,
  name: '',
  size: '',
  capacity: '',
  basePrice: 0,
  pricePerKm: 0,
  floorPrice: 0,
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入车型名称', trigger: 'blur' }],
  size: [{ required: true, message: '请输入车辆尺寸', trigger: 'blur' }],
  basePrice: [{ required: true, message: '请输入基础价格', trigger: 'blur' }],
  pricePerKm: [{ required: true, message: '请输入每公里价格', trigger: 'blur' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getVehicles()
    vehicles.value = res.data || []
  } catch (error) {
    console.error('Failed to load vehicles:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.id = null
  form.name = ''
  form.size = ''
  form.capacity = ''
  form.basePrice = 0
  form.pricePerKm = 0
  form.floorPrice = 0
  form.description = ''
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  showDialog.value = true
}

const handleToggle = async (row) => {
  try {
    await updateVehicle(row.id, { isActive: !row.isActive })
    ElMessage.success(row.isActive ? '已停用' : '已启用')
    loadData()
  } catch (error) {
    console.error('Failed to toggle vehicle:', error)
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await updateVehicle(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createVehicle(form)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    resetForm()
    loadData()
  } catch (error) {
    if (error !== false) {
      console.error('Failed to submit:', error)
    }
  }
}

watch(showDialog, (val) => {
  if (!val) {
    resetForm()
    isEdit.value = false
  }
})

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
