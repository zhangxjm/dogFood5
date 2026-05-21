<template>
  <div class="page">
    <van-nav-bar
      :title="id ? '编辑自提点' : '添加自提点'"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <van-cell-group inset>
        <van-field
          v-model="form.name"
          label="自提点名称"
          placeholder="请输入自提点名称"
        />
        <van-field
          v-model="form.address"
          label="详细地址"
          placeholder="请输入详细地址"
        />
        <van-field
          v-model="form.province"
          label="省份"
          placeholder="请输入省份"
        />
        <van-field
          v-model="form.city"
          label="城市"
          placeholder="请输入城市"
        />
        <van-field
          v-model="form.district"
          label="区县"
          placeholder="请输入区县"
        />
        <van-field
          v-model="form.contact_name"
          label="联系人"
          placeholder="请输入联系人姓名"
        />
        <van-field
          v-model="form.contact_phone"
          type="tel"
          label="联系电话"
          placeholder="请输入联系电话"
        />
        <van-field
          v-model="form.business_hours"
          label="营业时间"
          placeholder="如：08:00-20:00"
        />
      </van-cell-group>
      
      <van-button
        type="primary"
        block
        class="submit-btn"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ id ? '保存修改' : '添加自提点' }}
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

const id = route.query.id
const loading = ref(false)

const form = ref({
  name: '',
  address: '',
  province: '',
  city: '',
  district: '',
  contact_name: '',
  contact_phone: '',
  business_hours: ''
})

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const loadDetail = async () => {
  try {
    const res = await request({ url: `/pickup/detail/${id}` })
    Object.assign(form.value, res.data)
  } catch (e) {
    console.error(e)
  }
}

const handleSubmit = async () => {
  if (!form.value.name) {
    showToast('请输入自提点名称')
    return
  }
  if (!form.value.address) {
    showToast('请输入详细地址')
    return
  }
  if (!form.value.contact_name || !form.value.contact_phone) {
    showToast('请输入联系人信息')
    return
  }
  
  loading.value = true
  try {
    const data = { ...form.value, leader_id: leaderId }
    if (id) {
      await request({
        url: `/pickup/edit/${id}`,
        method: 'PUT',
        data
      })
      showToast('修改成功')
    } else {
      await request({
        url: '/pickup/add',
        method: 'POST',
        data
      })
      showToast('添加成功')
    }
    setTimeout(() => {
      router.back()
    }, 500)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onBack = () => {
  router.back()
}

onMounted(() => {
  if (id) {
    loadDetail()
  }
})
</script>

<style scoped>
.submit-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>
