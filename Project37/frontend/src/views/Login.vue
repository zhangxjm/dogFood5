<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <el-card style="width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
      <template #header>
        <div style="text-align: center; font-size: 24px; font-weight: bold; color: #333;">
          企业内部文件传阅系统
        </div>
      </template>
      <el-form :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center; color: #999; font-size: 12px;">
        测试账号: admin / 123456
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loginForm = {
      username: 'admin',
      password: '123456'
    }

    const handleLogin = async () => {
      try {
        const response = await axios.post(`/api/user/login?username=${loginForm.username}&password=${loginForm.password}`)
        if (response.data.code === 200) {
          localStorage.setItem('user', JSON.stringify(response.data.data))
          router.push('/home/upload')
        } else {
          alert(response.data.message)
        }
      } catch (error) {
        alert('登录失败，请检查服务是否启动')
      }
    }

    return {
      loginForm,
      handleLogin
    }
  }
}
</script>
