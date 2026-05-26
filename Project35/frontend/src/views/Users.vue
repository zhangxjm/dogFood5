<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">User Management</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        Add User
      </el-button>
    </div>

    <el-card>
      <el-table :data="users" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="Username" width="150" />
        <el-table-column prop="name" label="Name" width="150" />
        <el-table-column prop="department" label="Department" min-width="200" />
        <el-table-column prop="createdAt" label="Created Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showAddDialog" title="Add User" width="500px">
      <el-form :model="newUser" label-width="100px">
        <el-form-item label="Username">
          <el-input v-model="newUser.username" placeholder="Enter username" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="newUser.name" placeholder="Enter name" />
        </el-form-item>
        <el-form-item label="Department">
          <el-input v-model="newUser.department" placeholder="Enter department" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="addUser">Add</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { fetchUsers, createUser } from '../api'

const users = ref([])
const loading = ref(false)
const showAddDialog = ref(false)
const newUser = ref({
  username: '',
  name: '',
  department: ''
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetchUsers()
    users.value = response.data
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const addUser = async () => {
  if (!newUser.value.username || !newUser.value.name) {
    ElMessage.warning('Please fill in username and name')
    return
  }

  try {
    await createUser(newUser.value)
    ElMessage.success('User added successfully')
    showAddDialog.value = false
    newUser.value = { username: '', name: '', department: '' }
    loadData()
  } catch (error) {
    ElMessage.error('Failed to add user')
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}
</style>
