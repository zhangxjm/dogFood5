<template>
  <div class="auth-page">
    <el-card class="auth-card" shadow="hover">
      <h2>Create Account</h2>
      <p class="subtitle">Join the campus book exchange community</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="Choose a username" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" placeholder="Enter email" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Min 6 characters" show-password />
        </el-form-item>
        <el-form-item label="Full Name" prop="full_name">
          <el-input v-model="form.full_name" placeholder="Your real name (optional)" />
        </el-form-item>
        <el-form-item label="Campus" prop="campus">
          <el-input v-model="form.campus" placeholder="Your campus (optional)" />
        </el-form-item>
        <el-form-item label="Contact" prop="contact">
          <el-input v-model="form.contact" placeholder="WeChat/QQ/Email for exchange contact (optional)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="submit-btn" @click="handleRegister">
            Register
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer-text">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  campus: '',
  contact: ''
})
const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 3, message: 'At least 3 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'At least 6 characters', trigger: 'blur' }
  ]
}

async function handleRegister() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await api.post('/api/auth/register', form.value)
      ElMessage.success('Registration successful! Please login.')
      router.push('/login')
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
  width: 440px;
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
</style>
