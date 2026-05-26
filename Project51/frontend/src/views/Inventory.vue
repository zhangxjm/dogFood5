<template>
  <div class="page-card">
    <div class="toolbar">
      <div class="left">
        <el-input v-model="searchName" placeholder="搜索布草名称" clearable style="width: 200px;" @input="filterList" />
        <el-select v-model="searchType" placeholder="布草类型" clearable style="width: 150px;" @change="filterList">
          <el-option label="床上用品" value="床上用品" />
          <el-option label="浴室用品" value="浴室用品" />
          <el-option label="餐厅用品" value="餐厅用品" />
          <el-option label="员工用品" value="员工用品" />
        </el-select>
      </div>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增布草</el-button>
    </div>

    <el-table :data="filteredList" style="width: 100%;" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="布草名称" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="totalQuantity" label="总数量" width="100" />
      <el-table-column label="洁净" width="100">
        <template #default="{ row }">
          <el-tag type="success" size="small">{{ row.cleanQuantity }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="待洗" width="100">
        <template #default="{ row }">
          <el-tag type="danger" size="small">{{ row.dirtyQuantity }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用中" width="100">
        <template #default="{ row }">
          <el-tag type="warning" size="small">{{ row.inUseQuantity }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="存放位置" />
      <el-table-column prop="updateTime" label="更新时间" width="160" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑布草' : '新增布草'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="布草名称">
          <el-input v-model="form.name" placeholder="请输入布草名称" />
        </el-form-item>
        <el-form-item label="布草类型">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%;">
            <el-option label="床上用品" value="床上用品" />
            <el-option label="浴室用品" value="浴室用品" />
            <el-option label="餐厅用品" value="餐厅用品" />
            <el-option label="员工用品" value="员工用品" />
          </el-select>
        </el-form-item>
        <el-form-item label="总数量">
          <el-input-number v-model="form.totalQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="洁净数量">
          <el-input-number v-model="form.cleanQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="待洗数量">
          <el-input-number v-model="form.dirtyQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="使用中数量">
          <el-input-number v-model="form.inUseQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="存放位置">
          <el-input v-model="form.location" placeholder="请输入存放位置" />
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
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inventoryApi } from '../api'

const list = ref([])
const filteredList = ref([])
const searchName = ref('')
const searchType = ref('')
const dialogVisible = ref(false)
const form = ref({})

const loadData = async () => {
  try {
    const res = await inventoryApi.list()
    list.value = res.data || []
    filteredList.value = list.value
  } catch (e) {
    console.error(e)
  }
}

const filterList = () => {
  filteredList.value = list.value.filter(item => {
    const nameMatch = !searchName.value || item.name.includes(searchName.value)
    const typeMatch = !searchType.value || item.type === searchType.value
    return nameMatch && typeMatch
  })
}

const handleAdd = () => {
  form.value = { totalQuantity: 0, cleanQuantity: 0, dirtyQuantity: 0, inUseQuantity: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await inventoryApi.update(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await inventoryApi.add(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (e) {
    console.error(e)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', { type: 'warning' })
    await inventoryApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(loadData)
</script>
