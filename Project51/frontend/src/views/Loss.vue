<template>
  <div class="page-card">
    <div class="toolbar">
      <div class="left">
        <el-input v-model="searchName" placeholder="搜索布草名称" clearable style="width: 200px;" @input="filterList" />
      </div>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增损耗记录</el-button>
    </div>

    <el-table :data="filteredList" style="width: 100%;" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="linenName" label="布草名称" />
      <el-table-column prop="quantity" label="损耗数量" width="100" />
      <el-table-column prop="reason" label="损耗原因" show-overflow-tooltip />
      <el-table-column prop="lossTime" label="损耗时间" width="160" />
      <el-table-column prop="recorder" label="登记人" width="120" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑损耗记录' : '新增损耗记录'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择布草">
          <el-select v-model="form.linenId" placeholder="请选择布草" style="width: 100%;" @change="onLinenChange">
            <el-option v-for="item in inventoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="布草名称">
          <el-input v-model="form.linenName" readonly />
        </el-form-item>
        <el-form-item label="损耗数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="损耗原因">
          <el-input v-model="form.reason" placeholder="请输入损耗原因" />
        </el-form-item>
        <el-form-item label="登记人">
          <el-input v-model="form.recorder" placeholder="请输入登记人姓名" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { lossApi, inventoryApi } from '../api'

const list = ref([])
const filteredList = ref([])
const inventoryList = ref([])
const searchName = ref('')
const dialogVisible = ref(false)
const form = ref({})

const loadData = async () => {
  try {
    const [lossRes, invRes] = await Promise.all([
      lossApi.list(),
      inventoryApi.list()
    ])
    list.value = lossRes.data || []
    filteredList.value = list.value
    inventoryList.value = invRes.data || []
  } catch (e) {
    console.error(e)
  }
}

const filterList = () => {
  filteredList.value = list.value.filter(item => {
    return !searchName.value || item.linenName.includes(searchName.value)
  })
}

const onLinenChange = (id) => {
  const item = inventoryList.value.find(i => i.id === id)
  if (item) {
    form.value.linenName = item.name
  }
}

const handleAdd = () => {
  form.value = { quantity: 1 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await lossApi.update(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await lossApi.add(form.value)
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
    await lossApi.delete(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(loadData)
</script>
