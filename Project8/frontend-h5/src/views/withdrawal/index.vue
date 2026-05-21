<template>
  <div class="page">
    <van-nav-bar
      title="提现记录"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="withdrawal-item" v-for="item in list" :key="item.id">
            <div class="item-header">
              <span class="no">{{ item.withdrawal_no }}</span>
              <span class="status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</span>
            </div>
            <div class="item-body">
              <div class="amount-row">
                <span class="label">提现金额</span>
                <span class="value">¥{{ item.amount }}</span>
              </div>
              <div class="amount-row">
                <span class="label">实际到账</span>
                <span class="value success">¥{{ item.actual_amount }}</span>
              </div>
              <div class="info-row">
                <span class="label">收款方式</span>
                <span class="value">{{ getAccountType(item.account_type) }}</span>
              </div>
              <div class="info-row">
                <span class="label">收款账号</span>
                <span class="value">{{ item.account_no }}</span>
              </div>
            </div>
            <div class="item-footer">
              <span class="time">{{ item.created_at }}</span>
              <span class="remark" v-if="item.audit_remark">{{ item.audit_remark }}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      
      <van-empty v-if="list.length === 0 && !loading" description="暂无提现记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = 10

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const getStatusText = (status) => {
  const texts = { 0: '审核中', 1: '审核通过', 2: '审核拒绝', 3: '已打款' }
  return texts[status] || '未知'
}

const getStatusClass = (status) => {
  if (status === 0) return 'status-pending'
  if (status === 1 || status === 3) return 'status-success'
  return 'status-fail'
}

const getAccountType = (type) => {
  const types = { 1: '微信', 2: '支付宝', 3: '银行卡' }
  return types[type] || '未知'
}

const loadList = async () => {
  if (!leaderId) return
  
  try {
    const res = await request({ 
      url: `/withdrawal/list/${leaderId}?page=${page.value}&page_size=${pageSize}` 
    })
    const data = res.data
    
    if (refreshing.value) {
      list.value = data.list
      refreshing.value = false
    } else {
      list.value = [...list.value, ...data.list]
    }
    
    loading.value = false
    if (data.list.length < pageSize) {
      finished.value = true
    }
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

const onLoad = () => {
  if (!refreshing.value) {
    page.value++
    loadList()
  }
}

const onRefresh = () => {
  finished.value = false
  page.value = 1
  loadList()
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.withdrawal-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.no {
  font-size: 12px;
  color: #999;
}
.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}
.status-success {
  background: #f6ffed;
  color: #52c41a;
}
.status-fail {
  background: #fff1f0;
  color: #ff4d4f;
}
.item-body {
  padding: 12px 0;
}
.amount-row, .info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}
.amount-row .label, .info-row .label {
  font-size: 14px;
  color: #999;
}
.amount-row .value, .info-row .value {
  font-size: 14px;
  color: #333;
}
.amount-row .value.success {
  color: #52c41a;
  font-weight: 500;
}
.item-footer {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
.time {
  display: block;
  font-size: 12px;
  color: #999;
}
.remark {
  display: block;
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 6px;
}
</style>
