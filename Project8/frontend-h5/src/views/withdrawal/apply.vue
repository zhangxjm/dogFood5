<template>
  <div class="page">
    <van-nav-bar
      title="申请提现"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <div class="balance-card">
        <span class="label">可提现余额(元)</span>
        <span class="amount">¥{{ balance }}</span>
        <span class="tip">提现预计1-3个工作日到账</span>
      </div>
      
      <van-cell-group inset>
        <van-field
          v-model="form.amount"
          type="digit"
          label="提现金额"
          placeholder="请输入提现金额"
        />
        <div class="quick-amount">
          <span class="amount-btn" @click="quickAmount(10)">¥10</span>
          <span class="amount-btn" @click="quickAmount(50)">¥50</span>
          <span class="amount-btn" @click="quickAmount(100)">¥100</span>
          <span class="amount-btn" @click="quickAmount(balance)">全部</span>
        </div>
        
        <van-field
          v-model="form.account_type"
          is-link
          readonly
          label="收款方式"
          :value="typeOptions[form.account_type - 1]"
          placeholder="请选择收款方式"
          @click="showTypePopup = true"
        />
        <van-field
          v-model="form.account_name"
          label="收款人姓名"
          placeholder="请输入姓名"
        />
        <van-field
          v-model="form.account_no"
          label="收款账号"
          placeholder="请输入账号"
        />
        <van-field
          v-model="form.bank_name"
          label="银行名称"
          placeholder="请输入银行名称"
          v-if="form.account_type === 3"
        />
      </van-cell-group>
      
      <div class="fee-tip">
        <span>到账金额：¥{{ actualAmount }}  (手续费：¥0.00)</span>
      </div>
      
      <van-button
        type="primary"
        block
        class="submit-btn"
        :loading="loading"
        @click="handleSubmit"
      >
        确认提现
      </van-button>
      
      <div class="history-btn" @click="goHistory">
        <span>查看提现记录</span>
      </div>
    </div>
    
    <van-popup v-model:show="showTypePopup" position="bottom">
      <van-picker
        :columns="typeOptions"
        @confirm="onTypeConfirm"
        @cancel="showTypePopup = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import request from '@/utils/request'

const router = useRouter()

const balance = ref('0.00')
const loading = ref(false)
const showTypePopup = ref(false)
const typeOptions = ['微信', '支付宝', '银行卡']

const form = ref({
  amount: '',
  account_type: 1,
  account_name: '',
  account_no: '',
  bank_name: ''
})

const actualAmount = computed(() => {
  return form.value.amount || '0.00'
})

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const loadBalance = async () => {
  try {
    const res = await request({ url: `/earnings/statistics/${leaderId}` })
    balance.value = res.data.available_balance || '0.00'
  } catch (e) {
    console.error(e)
  }
}

const onTypeConfirm = ({ selectedOptions }) => {
  form.value.account_type = typeOptions.indexOf(selectedOptions[0]) + 1
  showTypePopup.value = false
}

const quickAmount = (amount) => {
  form.value.amount = String(amount)
}

const handleSubmit = async () => {
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    showToast('请输入提现金额')
    return
  }
  if (parseFloat(form.value.amount) > parseFloat(balance.value)) {
    showToast('余额不足')
    return
  }
  if (!form.value.account_name) {
    showToast('请输入收款人姓名')
    return
  }
  if (!form.value.account_no) {
    showToast('请输入收款账号')
    return
  }
  if (form.value.account_type === 3 && !form.value.bank_name) {
    showToast('请输入银行名称')
    return
  }
  
  try {
    await showConfirmDialog({
      title: '确认提现',
      message: `确认提现¥${form.value.amount}吗？`
    })
    
    loading.value = true
    await request({
      url: '/withdrawal/apply',
      method: 'POST',
      data: { ...form.value, leader_id: leaderId }
    })
    
    showToast('申请成功')
    setTimeout(() => {
      router.back()
    }, 500)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goHistory = () => {
  router.push('/withdrawal')
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  loadBalance()
})
</script>

<style scoped>
.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 16px;
}
.balance-card .label {
  display: block;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 8px;
}
.balance-card .amount {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}
.balance-card .tip {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}
.quick-amount {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
}
.amount-btn {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}
.fee-tip {
  background: #fffbeb;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 16px 0;
}
.fee-tip span {
  font-size: 13px;
  color: #e6a23c;
}
.submit-btn {
  margin-top: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.history-btn {
  text-align: center;
  padding: 20px;
}
.history-btn span {
  font-size: 14px;
  color: #667eea;
}
</style>
