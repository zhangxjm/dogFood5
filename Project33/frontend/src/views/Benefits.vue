<template>
  <div class="benefits">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>福利管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增福利
          </el-button>
        </div>
      </template>

      <el-table :data="benefits" border stripe>
        <el-table-column prop="name" label="福利名称" width="200" />
        <el-table-column prop="description" label="福利描述" />
        <el-table-column prop="pointsRequired" label="所需积分" width="120" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="claimedCount" label="已领取" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑福利' : '新增福利'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="福利名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="福利描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="所需积分" prop="pointsRequired">
          <el-input-number v-model="form.pointsRequired" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { benefitApi } from '@/api'

const benefits = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const form = ref({
  name: '',
  description: '',
  pointsRequired: 0,
  stock: 0,
  status: true
})

const loadBenefits = async () => {
  try {
    const res = await benefitApi.list()
    benefits.value = res.data
  } catch (error) {
    ElMessage.error('加载福利列表失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    description: '',
    pointsRequired: 0,
    stock: 0,
    status: true
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await benefitApi.update(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await benefitApi.create(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadBenefits()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该福利吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await benefitApi.delete(row.id)
    ElMessage.success('删除成功')
    loadBenefits()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadBenefits()
})
</script>