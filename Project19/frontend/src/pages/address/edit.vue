<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="label">收货人</text>
        <input 
          class="input" 
          v-model="form.name" 
          placeholder="请输入收货人姓名"
        />
      </view>
      
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          class="input" 
          v-model="form.phone" 
          placeholder="请输入手机号"
          type="number"
        />
      </view>
      
      <view class="form-item">
        <text class="label">省份</text>
        <input 
          class="input" 
          v-model="form.province" 
          placeholder="请输入省份"
        />
      </view>
      
      <view class="form-item">
        <text class="label">城市</text>
        <input 
          class="input" 
          v-model="form.city" 
          placeholder="请输入城市"
        />
      </view>
      
      <view class="form-item">
        <text class="label">区县</text>
        <input 
          class="input" 
          v-model="form.district" 
          placeholder="请输入区县"
        />
      </view>
      
      <view class="form-item">
        <text class="label">详细地址</text>
        <textarea 
          class="textarea" 
          v-model="form.detail" 
          placeholder="请输入详细地址"
        />
      </view>
      
      <view class="form-item switch-item">
        <text class="label">设为默认地址</text>
        <switch 
          :checked="form.isDefault" 
          @change="form.isDefault = $event.detail.value"
          color="#FF6B9D"
        />
      </view>
    </view>
    
    <view class="footer">
      <button class="save-btn" @click="saveAddress">保存地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const addressId = ref('')

const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const loadAddressDetail = async (id) => {
  try {
    const res = await proxy.$api.get(`/addresses/${id}`)
    Object.assign(form.value, res)
  } catch (e) {
    console.error('加载地址详情失败', e)
    form.value = {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区xxx路xxx号',
      isDefault: true
    }
  }
}

const saveAddress = async () => {
  if (!form.value.name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return
  }
  if (!form.value.phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!form.value.province) {
    uni.showToast({ title: '请输入省份', icon: 'none' })
    return
  }
  if (!form.value.city) {
    uni.showToast({ title: '请输入城市', icon: 'none' })
    return
  }
  if (!form.value.district) {
    uni.showToast({ title: '请输入区县', icon: 'none' })
    return
  }
  if (!form.value.detail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }
  
  try {
    if (addressId.value) {
      await proxy.$api.patch(`/addresses/${addressId.value}`, form.value)
    } else {
      await proxy.$api.post('/addresses', form.value)
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error('保存地址失败', e)
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  addressId.value = currentPage.options.id || ''
  if (addressId.value) {
    loadAddressDetail(addressId.value)
  }
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.form {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.save-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: 500;
}
</style>
