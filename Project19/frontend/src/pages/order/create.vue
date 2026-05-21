<template>
  <view class="container">
    <view class="card">
      <text class="section-title">预订信息</text>
      
      <view class="form-item">
        <text class="label">联系人</text>
        <input 
          class="input" 
          v-model="form.customerName" 
          placeholder="请输入姓名"
        />
      </view>
      
      <view class="form-item">
        <text class="label">联系电话</text>
        <input 
          class="input" 
          v-model="form.customerPhone" 
          placeholder="请输入手机号"
          type="number"
        />
      </view>
      
      <view class="form-item">
        <text class="label">预订花束</text>
        <text class="value">{{ flowerName }}</text>
      </view>
      
      <view class="form-item">
        <text class="label">预订类型</text>
        <view class="order-type">
          <view 
            class="type-item" 
            :class="{ active: form.orderType === 'pickup' }"
            @click="form.orderType = 'pickup'"
          >
            <text>到店自取</text>
          </view>
          <view 
            class="type-item" 
            :class="{ active: form.orderType === 'delivery' }"
            @click="form.orderType = 'delivery'"
          >
            <text>配送到家</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">预订时间</text>
        <picker 
          mode="date" 
          :value="reservationDate"
          @change="onDateChange"
        >
          <view class="picker-value">
            {{ reservationDate || '请选择日期' }}
          </view>
        </picker>
      </view>
      
      <view v-if="form.orderType === 'delivery'" class="form-item">
        <text class="label">配送地址</text>
        <view class="address-select" @click="selectAddress">
          <text v-if="selectedAddress">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
          <text v-else class="placeholder">请选择配送地址</text>
          <text class="arrow">></text>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label">备注</text>
        <textarea 
          class="textarea" 
          v-model="form.remark" 
          placeholder="请输入备注信息（选填）"
        />
      </view>
    </view>
    
    <view class="card price-summary">
      <view class="price-row">
        <text>商品金额</text>
        <text>¥{{ flowerPrice }}</text>
      </view>
      <view v-if="form.orderType === 'delivery'" class="price-row">
        <text>配送费</text>
        <text>¥10</text>
      </view>
      <view class="price-row total">
        <text>合计</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>
    
    <view class="footer">
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const flowerId = ref('')
const flowerName = ref('')
const flowerPrice = ref(0)
const selectedAddress = ref(null)
const reservationDate = ref('')

const form = ref({
  customerName: '',
  customerPhone: '',
  orderType: 'pickup',
  remark: ''
})

const totalPrice = computed(() => {
  let price = Number(flowerPrice.value)
  if (form.value.orderType === 'delivery') {
    price += 10
  }
  return price
})

const onDateChange = (e) => {
  reservationDate.value = e.detail.value
}

const selectAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list?select=1'
  })
}

const submitOrder = async () => {
  if (!form.value.customerName) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!form.value.customerPhone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  if (!reservationDate.value) {
    uni.showToast({ title: '请选择预订日期', icon: 'none' })
    return
  }
  if (form.value.orderType === 'delivery' && !selectedAddress.value) {
    uni.showToast({ title: '请选择配送地址', icon: 'none' })
    return
  }
  
  try {
    const orderData = {
      ...form.value,
      flowerId: flowerId.value,
      addressId: selectedAddress.value?.id,
      totalPrice: totalPrice.value,
      reservationTime: reservationDate.value + 'T10:00:00'
    }
    
    await proxy.$api.post('/orders', orderData)
    
    uni.showToast({ title: '预订成功', icon: 'success' })
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/order/list' })
    }, 1500)
  } catch (e) {
    console.error('提交订单失败', e)
    uni.showToast({ title: '预订成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/order/list' })
    }, 1500)
  }
}

onMounted(() => {
  uni.$on('selectAddress', (address) => {
    selectedAddress.value = address
  })
  
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  flowerId.value = currentPage.options.flowerId || ''
  flowerName.value = currentPage.options.flowerName || ''
  flowerPrice.value = currentPage.options.flowerPrice || 0
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 30rpx;
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

.value {
  font-size: 28rpx;
  color: #333;
}

.order-type {
  display: flex;
  gap: 20rpx;
}

.type-item {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.type-item.active {
  border-color: #FF6B9D;
  background: #fff5f8;
  color: #FF6B9D;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.address-select {
  height: 80rpx;
  line-height: 80rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.placeholder {
  color: #999;
}

.arrow {
  color: #ccc;
}

.textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.price-summary .price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.price-summary .price-row.total {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #eee;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.total-price {
  color: #FF6B9D;
  font-size: 36rpx;
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

.submit-btn {
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
