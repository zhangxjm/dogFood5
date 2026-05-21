<template>
  <div class="page">
    <van-nav-bar
      title="订单核销"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <div class="verify-card">
        <div class="verify-title">输入提货码</div>
        <van-field
          v-model="pickupCode"
          type="number"
          maxlength="6"
          placeholder="请输入6位提货码"
          class="code-input"
        />
        <van-button
          type="primary"
          block
          class="verify-btn"
          :disabled="pickupCode.length !== 6"
          @click="handleVerify"
        >
          确认核销
        </van-button>
      </div>
      
      <div class="tips">
        <div class="tip-title">核销说明</div>
        <div class="tip-item">• 请顾客出示提货码进行核销</div>
        <div class="tip-item">• 核销后订单状态变为已完成</div>
        <div class="tip-item">• 核销后佣金将自动计入收益</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const router = useRouter()

const pickupCode = ref('')
const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const handleVerify = async () => {
  if (pickupCode.value.length !== 6) {
    showToast('请输入完整的提货码')
    return
  }
  
  try {
    await showConfirmDialog({
      title: '确认核销',
      message: `确定核销提货码 ${pickupCode.value}？`
    })
    
    await request({
      url: '/order/verify',
      method: 'POST',
      data: {
        leader_id: leaderId,
        pickup_code: pickupCode.value
      }
    })
    
    showToast('核销成功')
    pickupCode.value = ''
  } catch (e) {
    console.error(e)
  }
}

const onBack = () => {
  router.back()
}
</script>

<style scoped>
.verify-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 20px;
}
.verify-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24px;
}
.code-input {
  margin-bottom: 24px;
}
.code-input :deep(.van-field__control) {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 8px;
}
.verify-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.tips {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}
.tip-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}
.tip-item {
  font-size: 13px;
  color: #666;
  line-height: 2;
}
</style>
