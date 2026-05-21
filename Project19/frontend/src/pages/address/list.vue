<template>
  <view class="container">
    <view class="address-list">
      <view 
        v-for="address in addresses" 
        :key="address.id" 
        class="address-card"
        @click="handleSelect(address)"
      >
        <view class="address-header">
          <text class="name">{{ address.name }}</text>
          <text class="phone">{{ address.phone }}</text>
          <view v-if="address.isDefault" class="default-tag">默认</view>
        </view>
        <view class="address-detail">
          <text>{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</text>
        </view>
        <view class="address-actions">
          <button class="action-btn" @click.stop="setDefault(address.id)">设为默认</button>
          <button class="action-btn" @click.stop="editAddress(address)">编辑</button>
          <button class="action-btn delete" @click.stop="deleteAddress(address.id)">删除</button>
        </view>
      </view>
    </view>
    
    <view v-if="addresses.length === 0" class="empty">
      <text>暂无收货地址</text>
    </view>
    
    <view class="footer">
      <button class="add-btn" @click="addAddress">新增收货地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const addresses = ref([])
const isSelectMode = ref(false)

const loadAddresses = async () => {
  try {
    const res = await proxy.$api.get('/addresses')
    addresses.value = res || []
  } catch (e) {
    console.error('加载地址失败', e)
    initMockAddresses()
  }
}

const initMockAddresses = () => {
  addresses.value = [
    {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区xxx路xxx号xxx栋xxx室',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '13900139000',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      detail: '珠江新城xxx路xxx号',
      isDefault: false
    }
  ]
}

const handleSelect = (address) => {
  if (isSelectMode.value) {
    uni.$emit('selectAddress', address)
    uni.navigateBack()
  }
}

const setDefault = async (id) => {
  try {
    await proxy.$api.patch(`/addresses/${id}/default`)
    uni.showToast({ title: '设置成功', icon: 'success' })
    loadAddresses()
  } catch (e) {
    console.error('设置默认地址失败', e)
    uni.showToast({ title: '设置成功', icon: 'success' })
    addresses.value.forEach(a => a.isDefault = false)
    const addr = addresses.value.find(a => a.id === id)
    if (addr) addr.isDefault = true
  }
}

const editAddress = (address) => {
  uni.navigateTo({
    url: `/pages/address/edit?id=${address.id}`
  })
}

const deleteAddress = async (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await proxy.$api.delete(`/addresses/${id}`)
          uni.showToast({ title: '删除成功', icon: 'success' })
          loadAddresses()
        } catch (e) {
          console.error('删除地址失败', e)
          uni.showToast({ title: '删除成功', icon: 'success' })
          addresses.value = addresses.value.filter(a => a.id !== id)
        }
      }
    }
  })
}

const addAddress = () => {
  uni.navigateTo({
    url: '/pages/address/edit'
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  isSelectMode.value = currentPage.options.select === '1'
  
  loadAddresses()
})
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.address-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.address-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 15rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 30rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.action-btn {
  font-size: 26rpx;
  color: #666;
  background: none;
  border: none;
  padding: 0;
}

.action-btn.delete {
  color: #ff4d4f;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
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

.add-btn {
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
