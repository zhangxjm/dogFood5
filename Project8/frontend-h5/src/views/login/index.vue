<template>
  <div class="login-page">
    <div class="logo-section">
      <div class="logo-icon">
        <span class="logo-text">团</span>
      </div>
      <h1 class="app-name">社区团购团长端</h1>
    </div>
    
    <div class="form-section">
      <van-field
        v-model="phone"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        maxlength="11"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
      />
      
      <van-button
        type="primary"
        block
        class="login-btn"
        :loading="loading"
        @click="handleLogin"
      >
        登录
      </van-button>
      
      <div class="tip">
        <span>默认账号：13800138000 / 密码：123456</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('13800138000')
const password = ref('123456')
const loading = ref(false)

const handleLogin = async () => {
  if (!phone.value || !password.value) {
    showToast('请输入账号密码')
    return
  }
  
  loading.value = true
  try {
    await userStore.login(phone.value, password.value)
    showToast('登录成功')
    setTimeout(() => {
      router.push('/home')
    }, 500)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 24px;
}
.logo-section {
  text-align: center;
  margin-bottom: 60px;
}
.logo-icon {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.logo-text {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  color: transparent;
}
.app-name {
  color: #fff;
  font-size: 22px;
  font-weight: 500;
  margin: 0;
}
.form-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
}
.login-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.tip {
  margin-top: 24px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>
