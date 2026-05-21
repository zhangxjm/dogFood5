<template>
  <div class="member-levels">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>会员等级管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增等级
          </el-button>
        </div>
      </template>

      <el-table :data="levels" border stripe>
        <el-table-column prop="name" label="等级名称" width="150" />
        <el-table-column prop="minPoints" label="最小积分" width="120" />
        <el-table-column prop="maxPoints" label="最大积分" width="120" />
        <el-table-column prop="discountRate" label="折扣率" width="120">
          <template #default="scope">
            {{ scope.row.discountRate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="isDefault" label="默认等级" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isDefault ? 'success' : 'info'">
            {{ scope.row.isDefault ? '是' : '否' }}
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
      :title="isEdit ? '编辑等级' : '新增等级'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="最小积分" prop="minPoints">
          <el-input-number v-model="form.minPoints" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="最大积分" prop="maxPoints">
          <el-input-number v-model="form.maxPoints" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="折扣率" prop="discountRate">
          <el-input-number v-model="form.discountRate" :min="0" :max="10" :step="0.1" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="默认等级" prop="isDefault">
          <el-switch v-model="form.isDefault" />
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
import { memberLevelApi } from '@/api'

const levels = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const form = ref({
  name: '',
  minPoints: 0,
  maxPoints: 0,
  discountRate: '',
  description: '',
  isDefault: false
})

const loadLevels = async () => {
  try {
    const res = await memberLevelApi.list()
    levels.value = res.data
  } catch (error) {
    ElMessage.error('加载等级列表失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    minPoints: 0,
    maxPoints: 0,
    discountRate: '',
    description: '',
    isDefault: false
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
      await memberLevelApi.update(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await memberLevelApi.create(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadLevels()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该等级吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await memberLevelApi.delete(row.id)
    ElMessage.success('删除成功')
    loadLevels()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadLevels()
})
</script>