<template>
  <div>
    <a-card>
      <a-space style="margin-bottom: 16px">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索商品名称"
          style="width: 200px"
          @search="loadData"
          allow-clear
        />
        <a-select v-model:value="filterCategory" placeholder="全部分类" style="width: 150px" allow-clear @change="loadData">
          <a-select-option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</a-select-option>
        </a-select>
        <a-button type="primary" @click="showModal()">
          <template #icon><plus-outlined /></template>
          新增商品
        </a-button>
      </a-space>

      <a-table :columns="columns" :data-source="products" :loading="loading" row-key="_id" :scroll="{ x: 1400 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'category'">
            {{ record.categoryId?.name || '-' }}
          </template>
          <template v-if="column.key === 'stock'">
            <a-tag :color="record.stock <= record.minStock ? 'red' : 'green'">
              {{ record.stock }}
            </a-tag>
          </template>
          <template v-if="column.key === 'expiryDate'">
            <div>{{ formatDate(record.expiryDate) }}</div>
            <a-tag v-if="getDaysLeft(record.expiryDate) <= 30" :color="getDaysLeft(record.expiryDate) <= 0 ? 'red' : 'orange'">
              {{ getDaysLeft(record.expiryDate) }}天
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showSaleModal(record)">售卖</a-button>
              <a-button type="link" size="small" @click="showModal(record)">编辑</a-button>
              <a-popconfirm title="确定删除该商品？" @confirm="handleDelete(record._id)">
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑商品' : '新增商品'" @ok="handleSubmit" :width="600">
      <a-form :model="formState" :rules="rules" ref="formRef" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="商品名称" name="name">
              <a-input v-model:value="formState.name" placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属品类" name="categoryId">
              <a-select v-model:value="formState.categoryId" placeholder="请选择品类">
                <a-select-option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="进价" name="cost">
              <a-input-number v-model:value="formState.cost" placeholder="进价" :min="0" :precision="2" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="售价" name="price">
              <a-input-number v-model:value="formState.price" placeholder="售价" :min="0" :precision="2" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位" name="unit">
              <a-input v-model:value="formState.unit" placeholder="瓶/箱" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="库存数量" name="stock">
              <a-input-number v-model:value="formState.stock" placeholder="库存" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="最低库存" name="minStock">
              <a-input-number v-model:value="formState.minStock" placeholder="最低库存" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="过期日期" name="expiryDate">
              <a-date-picker v-model:value="formState.expiryDate" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-modal v-model:open="saleModalVisible" title="商品售卖" @ok="handleSale" :width="500">
      <a-descriptions :column="1" bordered size="small" style="margin-bottom: 16px">
        <a-descriptions-item label="商品名称">{{ saleProduct.name }}</a-descriptions-item>
        <a-descriptions-item label="售价">¥{{ saleProduct.price?.toFixed(2) }}/{{ saleProduct.unit }}</a-descriptions-item>
        <a-descriptions-item label="当前库存">{{ saleProduct.stock }}{{ saleProduct.unit }}</a-descriptions-item>
      </a-descriptions>
      <a-form :model="saleForm" layout="vertical">
        <a-form-item label="售卖数量">
          <a-input-number v-model:value="saleForm.quantity" :min="1" :max="saleProduct.stock" style="width: 100%" />
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
        <a-alert type="info" show-icon :message="`应收金额: ¥${(saleProduct.price * saleForm.quantity).toFixed(2)}`" />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { productApi, categoryApi, saleApi } from '../services/api'
import dayjs from 'dayjs'

const loading = ref(false)
const products = ref([])
const categories = ref([])
const searchKeyword = ref('')
const filterCategory = ref('')

const modalVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const formState = ref({
  name: '',
  categoryId: '',
  price: 0,
  cost: 0,
  unit: '瓶',
  stock: 0,
  minStock: 10,
  expiryDate: null
})

const rules = {
  name: [{ required: true, message: '请输入商品名称' }],
  categoryId: [{ required: true, message: '请选择品类' }],
  price: [{ required: true, message: '请输入售价' }],
  cost: [{ required: true, message: '请输入进价' }],
  expiryDate: [{ required: true, message: '请选择过期日期' }]
}

const saleModalVisible = ref(false)
const saleProduct = ref({})
const saleForm = ref({
  quantity: 1,
  customerName: '',
  paymentMethod: '现金'
})

const columns = [
  { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '品类', key: 'category', width: 100 },
  { title: '进价', dataIndex: 'cost', key: 'cost', width: 80 },
  { title: '售价', dataIndex: 'price', key: 'price', width: 80 },
  { title: '库存', key: 'stock', width: 80 },
  { title: '最低库存', dataIndex: 'minStock', key: 'minStock', width: 80 },
  { title: '过期日期', key: 'expiryDate', width: 180 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' }
]

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const getDaysLeft = (date) => {
  return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day')
}

const loadCategories = async () => {
  try {
    const res = await categoryApi.getAll()
    if (res.success) categories.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchKeyword.value) params.keyword = searchKeyword.value
    if (filterCategory.value) params.categoryId = filterCategory.value
    const res = await productApi.getAll(params)
    if (res.success) products.value = res.data
  } catch (error) {
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const showModal = (record) => {
  if (record) {
    isEdit.value = true
    editId.value = record._id
    formState.value = {
      name: record.name,
      categoryId: record.categoryId?._id || record.categoryId,
      price: record.price,
      cost: record.cost,
      unit: record.unit,
      stock: record.stock,
      minStock: record.minStock,
      expiryDate: dayjs(record.expiryDate)
    }
  } else {
    isEdit.value = false
    editId.value = null
    formState.value = {
      name: '',
      categoryId: '',
      price: 0,
      cost: 0,
      unit: '瓶',
      stock: 0,
      minStock: 10,
      expiryDate: null
    }
  }
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const submitData = {
      ...formState.value,
      expiryDate: formState.value.expiryDate?.toISOString()
    }
    const res = isEdit.value
      ? await productApi.update(editId.value, submitData)
      : await productApi.create(submitData)
    if (res.success) {
      message.success(res.message)
      modalVisible.value = false
      loadData()
    } else {
      message.error(res.message)
    }
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    const res = await productApi.delete(id)
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

const showSaleModal = (record) => {
  saleProduct.value = record
  saleForm.value = {
    quantity: 1,
    customerName: '',
    paymentMethod: '现金'
  }
  saleModalVisible.value = true
}

const handleSale = async () => {
  try {
    const res = await saleApi.create({
      productId: saleProduct.value._id,
      quantity: saleForm.value.quantity,
      customerName: saleForm.value.customerName,
      paymentMethod: saleForm.value.paymentMethod
    })
    if (res.success) {
      message.success(res.message)
      saleModalVisible.value = false
      loadData()
    } else {
      message.error(res.message)
    }
  } catch (error) {
    message.error('售卖失败')
  }
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>
