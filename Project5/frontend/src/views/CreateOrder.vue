<template>
  <div class="create-order">
    <van-nav-bar title="发布订单" left-arrow @click-left="$router.back()" />
    
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.serviceTypeId"
          name="serviceTypeId"
          label="服务类型"
          placeholder="请选择服务类型"
          readonly
          is-link
          @click="showServicePicker = true"
          :value="getServiceTypeName()"
        />
        <van-field
          v-model="form.title"
          name="title"
          label="订单标题"
          placeholder="请输入订单标题"
          :rules="[{ required: true, message: '请填写订单标题' }]"
        />
        <van-field
          v-model="form.description"
          name="description"
          label="订单描述"
          type="textarea"
          placeholder="请输入订单描述"
          :rules="[{ required: true, message: '请填写订单描述' }]"
        />
        <van-field
          v-model="form.pickupAddress"
          name="pickupAddress"
          label="取件地址"
          placeholder="请输入取件地址"
          :rules="[{ required: true, message: '请填写取件地址' }]"
        />
        <van-field
          v-model="form.deliveryAddress"
          name="deliveryAddress"
          label="送达地址"
          placeholder="请输入送达地址"
          :rules="[{ required: true, message: '请填写送达地址' }]"
        />
        <van-field
          v-model="form.price"
          name="price"
          label="酬金"
          type="number"
          placeholder="请输入酬金"
          :rules="[{ required: true, message: '请填写酬金' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          发布订单
        </van-button>
      </div>
    </van-form>

    <van-popup v-model:show="showServicePicker" position="bottom">
      <van-picker
        :columns="serviceColumns"
        @confirm="onServiceConfirm"
        @cancel="showServicePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { store } from '../store'
import { serviceTypeApi, orderApi } from '../api'

const router = useRouter()
const form = ref({
  serviceTypeId: '',
  title: '',
  description: '',
  pickupAddress: '',
  deliveryAddress: '',
  price: 0
})
const serviceTypes = ref([])
const serviceColumns = ref([])
const showServicePicker = ref(false)

onMounted(() => {
  loadServiceTypes()
})

async function loadServiceTypes() {
  try {
    const res = await serviceTypeApi.getAll()
    serviceTypes.value = res.data
    serviceColumns.value = res.data.map(item => ({ text: item.name, value: item._id }))
  } catch (e) {
    showToast('加载服务类型失败')
  }
}

function getServiceTypeName() {
  const service = serviceTypes.value.find(s => s._id === form.value.serviceTypeId)
  return service ? service.name : ''
}

function onServiceConfirm({ selectedOptions }) {
  form.value.serviceTypeId = selectedOptions[0].value
  showServicePicker.value = false
}

async function onSubmit() {
  if (!store.isLoggedIn()) {
    showToast('请先登录')
    return
  }
  try {
    await orderApi.create({
      ...form.value,
      customerId: store.getUserId()
    })
    showToast('发布成功')
    router.back()
  } catch (e) {
    console.error('Create order error:', e)
    showToast(e.response?.data?.message || '发布失败')
  }
}
</script>

<style scoped>
.create-order {
  padding-bottom: 20px;
}
</style>
