<template>
  <div class="auth-page">
    <el-card class="auth-card" shadow="hover">
      <h2>Welcome Back</h2>
      <p class="subtitle">Login to continue exchanging books</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="Enter username" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Enter password" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="submit-btn" @click="handleLogin">
            Login
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer-text">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </div>
      <el-divider>Or use demo accounts</el-divider>
      <div class="demo-accounts">
        <el-tag type="info" size="small">alice / alice123</el-tag>
        <el-tag type="info" size="small">bob / bob12345</el-tag>
        <el-tag type="info" size="small">carol / carol123</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)
const form = ref({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }]
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      const res = await api.post('/api/auth/login', form.value)
      const token = res.data.access_token
      const userRes = await api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      authStore.setAuth(token, userRes.data)
      ElMessage.success('Login successful!')
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } catch (e) {
      // error handled by interceptor
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.auth-card {
  width: 400px;
  border-radius: 12px;
}
.auth-card h2 {
  margin: 0 0 6px 0;
  text-align: center;
}
.subtitle {
  text-align: center;
  color: #909399;
  margin: 0 0 20px 0;
}
.submit-btn {
  width: 100%;
}
.footer-text {
  text-align: center;
  color: #606266;
  font-size: 14px;
}
.demo-accounts {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
