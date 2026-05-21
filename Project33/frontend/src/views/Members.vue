<template>
  <div class="members">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>会员管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增会员
          </el-button>
        </div>
      </template>

      <div style="margin-bottom: 20px;">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索会员（姓名/手机号/会员号）"
          style="width: 300px; margin-right: 10px;"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="loadMembers">重置</el-button>
      </div>

      <el-table :data="members" border stripe>
        <el-table-column prop="memberNo" label="会员号" width="150" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="level.name" label="等级" width="120" />
        <el-table-column prop="totalPoints" label="总积分" width="100" />
        <el-table-column prop="availablePoints" label="可用积分" width="100" />
        <el-table-column prop="totalConsumption" label="总消费" width="120">
          <template #default="scope">
            ¥{{ scope.row.totalConsumption }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑会员' : '新增会员'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
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
import { memberApi } from '@/api'

const members = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const searchKeyword = ref('')

const form = ref({
  name: '',
  phone: '',
  gender: '',
  birthday: '',
  address: '',
  email: '',
  remark: '',
  status: true
})

const loadMembers = async () => {
  try {
    const res = await memberApi.list()
    members.value = res.data
  } catch (error) {
    ElMessage.error('加载会员列表失败')
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value) {
    loadMembers()
    return
  }
  try {
    const res = await memberApi.search(searchKeyword.value)
    members.value = res.data
  } catch (error) {
    ElMessage.error('搜索失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    phone: '',
    gender: '',
    birthday: '',
    address: '',
    email: '',
    remark: '',
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
      await memberApi.update(form.value.id, form.value)
      ElMessage.success('更新成功')
    } else {
      await memberApi.create(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadMembers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该会员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await memberApi.delete(row.id)
    ElMessage.success('删除成功')
    loadMembers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadMembers()
})
</script>