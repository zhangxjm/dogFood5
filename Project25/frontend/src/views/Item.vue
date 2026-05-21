<template>
  <div>
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>文具清单</span>
          <el-button type="primary" @click="handleAdd">新增文具</el-button>
        </div>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="itemName" label="文具名称" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="unitPrice" label="单价" width="120">
          <template #default="scope">¥{{ scope.row.unitPrice }}</template>
        </el-table-column>
        <el-table-column prop="stockQuantity" label="库存数量" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="文具名称">
          <el-input v-model="form.itemName" />
        </el-form-item>
        <el-form-item label="品类">
          <el-select v-model="form.categoryId" placeholder="请选择品类" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.categoryName" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.specification" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" />
        </el-form-item>
        <el-form-item label="单价">
          <el-input-number v-model="form.unitPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
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
import request from '@/utils/request'

const tableData = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增文具')
const isEdit = ref(false)

const form = ref({
  id: null,
  itemName: '',
  categoryId: null,
  specification: '',
  unit: '',
  unitPrice: 0,
  description: ''
})

const fetchData = async () => {
  const res = await request.get('/item/list')
  tableData.value = res.data
}

const fetchCategories = async () => {
  const res = await request.get('/category/list')
  categories.value = res.data
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增文具'
  form.value = { id: null, itemName: '', categoryId: null, specification: '', unit: '', unitPrice: 0, description: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑文具'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await request.delete(`/item/${id}`)
    ElMessage.success('删除成功')
    fetchData()
  })
}

const handleSubmit = async () => {
  if (isEdit.value) {
    await request.put('/item', form.value)
    ElMessage.success('更新成功')
  } else {
    await request.post('/item', form.value)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>
