<template>
  <div>
    <a-card>
      <a-space style="margin-bottom: 16px">
        <a-range-picker v-model:value="dateRange" @change="loadData" />
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索商品名称"
          style="width: 200px"
          @search="loadData"
          allow-clear
        />
        <a-button @click="showSaleModal">
          <template #icon><plus-outlined /></template>
          新增售卖
        </a-button>
      </a-space>

      <a-table :columns="columns" :data-source="sales" :loading="loading" row-key="_id" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'totalPrice'">
            ¥{{ record.totalPrice.toFixed(2) }}
          </template>
          <template v-if="column.key === 'paymentMethod'">
            <a-tag :color="getPaymentColor(record.paymentMethod)">{{ record.paymentMethod }}</a-tag>
          </template>
          <template v-if="column.key === 'saleTime'">
            {{ formatDateTime(record.saleTime) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-popconfirm title="确定删除该记录？" @confirm="handleDelete(record._id)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="saleModalVisible" title="新增售卖" @ok="handleSale" :width="600">
      <a-form :model="saleForm" layout="vertical">
        <a-form-item label="选择商品" required>
          <a-select v-model:value="saleForm.productId" placeholder="请选择商品" show-search option-filter-prop="label" @change="onProductChange">
            <a-select-option
              v-for="p in products"
              :key="p._id"
              :value="p._id"
              :label="p.name"
            >
              {{ p.name }} - 库存: {{ p.stock }} - ¥{{ p.price }}/{{ p.unit }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="selectedProduct" label="商品信息">
          <a-descriptions :column="1" size="small" bordered>
            <a-descriptions-item label="当前库存">{{ selectedProduct.stock }}{{ selectedProduct.unit }}</a-descriptions-item>
            <a-descriptions-item label="售价">¥{{ selectedProduct.price?.toFixed(2) }}/{{ selectedProduct.unit }}</a-descriptions-item>
          </a-descriptions>
        </a-form-item>
        <a-form-item label="售卖数量" required>
          <a-input-number v-model:value="saleForm.quantity" :min="1" :max="selectedProduct?.stock || 999" style="width: 100%" />
        </a-form-item>
        <a-form-item label="客户姓名">
          <a-input v-model:value="saleForm.customerName" placeholder="选填" />
        </a-form-item>
        <a-form-item label="支付方式">
          <a-select v-model:value="saleForm.paymentMethod">
            <a-select-option value="现金">现金</a-select-option>
            <a-select-option value="微信">微信</a-select-option>
            <a-select-option value="支付宝">支付宝</a-select-option>
            <a-select-option value="银行卡">银行卡</a-select-option>
          </a-select>
        </a-form-item>
        <a-alert v-if="selectedProduct" type="info" show-icon :message="`应收金额: ¥${(selectedProduct.price * saleForm.quantity).toFixed(2)}`" />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { saleApi, productApi } from '../services/api'
import dayjs from 'dayjs'

const loading = ref(false)
const sales = ref([])
const products = ref([])
const searchKeyword = ref('')
const dateRange = ref([dayjs().startOf('month'), dayjs().endOf('month')])

const saleModalVisible = ref(false)
const saleForm = ref({
  productId: '',
  quantity: 1,
  customerName: '',
  paymentMethod: '现金'
})

const selectedProduct = computed(() => {
  return products.value.find(p => p._id === saleForm.value.productId)
})

const columns = [
  { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 150 },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80 },
  { title: '单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 100 },
  { title: '总价', key: 'totalPrice', width: 100 },
  { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 100 },
  { title: '支付方式', key: 'paymentMethod', width: 100 },
  { title: '售卖时间', key: 'saleTime', width: 180 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' }
]

const formatDateTime = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const getPaymentColor = (method) => {
  const colors = {
    '现金': 'blue',
    '微信': 'green',
    '支付宝': 'cyan',
    '银行卡': 'purple'
  }
  return colors[method] || 'default'
}

const loadProducts = async () => {
  try {
    const res = await productApi.getAll({})
    if (res.success) products.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0].format('YYYY-MM-DD')
      params.endDate = dateRange.value[1].format('YYYY-MM-DD')
    }
    const res = await saleApi.getAll(params)
    if (res.success) sales.value = res.data
  } catch (error) {
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const showSaleModal = () => {
  saleForm.value = {
    productId: '',
    quantity: 1,
    customerName: '',
    paymentMethod: '现金'
  }
  saleModalVisible.value = true
}

const onProductChange = () => {
  saleForm.value.quantity = 1
}

const handleSale = async () => {
  if (!saleForm.value.productId) {
    message.error('请选择商品')
    return
  }
  try {
    const res = await saleApi.create(saleForm.value)
    if (res.success) {
      message.success(res.message)
      saleModalVisible.value = false
      loadData()
      loadProducts()
    } else {
      message.error(res.message)
    }
  } catch (error) {
    message.error('售卖失败')
  }
}

const handleDelete = async (id) => {
  try {
    const res = await saleApi.delete(id)
    if (res.success) {
      message.success(res.message)
      loadData()
    } else {
      message.error(res.message)
    }
  } catch (error) {
    message.error('删除失败')
  }
}

onMounted(() => {
  loadProducts()
  loadData()
})
</script>
