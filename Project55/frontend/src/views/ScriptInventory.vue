<template>
  <div class="page">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span class="title">剧本库存管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增剧本
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="剧本名称" align="center" />
        <el-table-column prop="typeId" label="类型" align="center" width="120">
          <template #default="{ row }">
            <el-tag>{{ typeMap[row.typeId] || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="minPlayers" label="最少人数" align="center" width="100" />
        <el-table-column prop="maxPlayers" label="最多人数" align="center" width="100" />
        <el-table-column prop="duration" label="时长(分钟)" align="center" width="110" />
        <el-table-column prop="author" label="作者" align="center" width="100" />
        <el-table-column prop="totalCopies" label="总库存" align="center" width="90" />
        <el-table-column prop="availableCopies" label="可借库存" align="center" width="90">
          <template #default="{ row }">
            <el-tag :type="row.availableCopies > 0 ? 'success' : 'danger'">{{ row.availableCopies }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="180" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item label="剧本名称" prop="name" :rules="[{ required: true, message: '请输入剧本名称', trigger: 'blur' }]">
          <el-input v-model="form.name" placeholder="请输入剧本名称" />
        </el-form-item>
        <el-form-item label="剧本类型" prop="typeId" :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
          <el-select v-model="form.typeId" placeholder="请选择类型" style="width: 100%">
            <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最少人数" prop="minPlayers">
              <el-input-number v-model="form.minPlayers" :min="1" :max="20" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最多人数" prop="maxPlayers">
              <el-input-number v-model="form.maxPlayers" :min="1" :max="20" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时长(分钟)" prop="duration">
              <el-input-number v-model="form.duration" :min="30" :max="600" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社">
              <el-input v-model="form.publisher" placeholder="请输入出版社" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="总库存" prop="totalCopies">
              <el-input-number v-model="form.totalCopies" :min="1" :max="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可借库存" prop="availableCopies">
              <el-input-number v-model="form.availableCopies" :min="0" :max="100" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
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
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getScriptInventoryList, addScriptInventory, updateScriptInventory, deleteScriptInventory, getScriptTypeList } from '../api'

const tableData = ref([])
const types = ref([])
const typeMap = reactive({})
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const isEdit = ref(false)
const form = ref({
  id: null, name: '', typeId: null, minPlayers: 4, maxPlayers: 6,
  duration: 240, author: '', publisher: '', description: '',
  totalCopies: 1, availableCopies: 1
})

const loadData = async () => {
  tableData.value = await getScriptInventoryList()
  types.value = await getScriptTypeList()
  types.value.forEach(t => { typeMap[t.id] = t.name })
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增剧本'
  form.value = {
    id: null, name: '', typeId: null, minPlayers: 4, maxPlayers: 6,
    duration: 240, author: '', publisher: '', description: '',
    totalCopies: 1, availableCopies: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑剧本'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    await updateScriptInventory(form.value)
    ElMessage.success('更新成功')
  } else {
    await addScriptInventory(form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该剧本吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteScriptInventory(row.id)
      ElMessage.success('删除成功')
      loadData()
    }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 16px; font-weight: 600; }
</style>
