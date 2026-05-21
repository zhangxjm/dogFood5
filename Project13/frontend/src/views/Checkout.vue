<template>
  <div class="checkout-page">
    <van-nav-bar title="确认订单" left-arrow @click-left="goBack" />
    
    <van-form @submit="submitOrder">
      <van-cell-group inset>
        <van-field
          v-model="form.customerName"
          name="customerName"
          label="顾客姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="form.customerPhone"
          name="customerPhone"
          label="联系电话"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入电话' }]"
        />
        <van-field
          v-model="form.remark"
          name="remark"
          label="备注"
          type="textarea"
          placeholder="选填，如：少冰、少糖"
          rows="2"
        />
      </van-cell-group>

      <van-cell-group inset title="已选商品" class="goods-group">
        <van-cell
          v-for="item in cartItems"
          :key="item.drinkId"
          :title="item.drinkName"
          :label="'数量: ' + item.quantity"
        >
          <template #value>
            ¥{{ (item.price * item.quantity).toFixed(2) }}
          </template>
        </van-cell>
      </van-cell-group>

      <div class="total-section">
        <van-cell title="订单总额">
          <template #value>
            <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
          </template>
        </van-cell>
      </div>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="submitting">
          提交订单
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { orderApi } from '@/api'

const router = useRouter()
const route = useRoute()

const cartItems = ref([])
const totalPrice = ref(0)
const submitting = ref(false)

const form = ref({
  customerName: '',
  customerPhone: '',
  remark: '',
  items: [],
  totalAmount: 0
})

const goBack = () => {
  router.back()
}

const submitOrder = async () => {
  submitting.value = true
  try {
    form.value.items = cartItems.value
    form.value.totalAmount = totalPrice.value
    
    const res = await orderApi.create(form.value)
    if (res.code === 200) {
      showSuccessToast('下单成功')
      setTimeout(() => {
        router.push('/orders')
      }, 1000)
    } else {
      showToast(res.message || '下单失败')
    }
  } catch (e) {
    showToast('下单失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (route.query.cart) {
    cartItems.value = JSON.parse(route.query.cart)
    totalPrice.value = parseFloat(route.query.totalPrice)
  }
})
</script>

<style scoped>
.checkout-page {
  padding-bottom: 20px;
}
.goods-group {
  margin-top: 12px;
}
.total-section {
  margin-top: 12px;
}
.total-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}
</style>
