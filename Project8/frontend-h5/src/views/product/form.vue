<template>
  <div class="page">
    <van-nav-bar
      :title="id ? '编辑商品' : '添加商品'"
      left-text="返回"
      @click-left="onBack"
    />
    
    <div class="page-content">
      <van-cell-group inset>
        <van-field
          v-model="form.name"
          label="商品名称"
          placeholder="请输入商品名称"
        />
        <van-field
          v-model="form.category_id"
          is-link
          readonly
          label="商品分类"
          :value="categoryName"
          placeholder="请选择分类"
          @click="showCategoryPopup = true"
        />
        <van-field
          v-model="form.price"
          type="digit"
          label="售价"
          placeholder="请输入售价"
        />
        <van-field
          v-model="form.commission_rate"
          type="digit"
          label="佣金比例(%)"
          placeholder="请输入佣金比例"
        />
        <van-field
          v-model="form.stock"
          type="number"
          label="库存数量"
          placeholder="请输入库存"
        />
        <van-field
          v-model="form.unit"
          label="计量单位"
          placeholder="如：件、斤、盒"
        />
        <van-field
          v-model="form.description"
          type="textarea"
          label="商品描述"
          placeholder="请输入商品描述"
          autosize
        />
      </van-cell-group>
      
      <van-button
        type="primary"
        block
        class="submit-btn"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ id ? '保存修改' : '添加商品' }}
      </van-button>
    </div>
    
    <van-popup v-model:show="showCategoryPopup" position="bottom">
      <van-picker
        :columns="categories"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPopup = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

const id = route.query.id
const loading = ref(false)
const showCategoryPopup = ref(false)
const categories = ref([])
const selectedCategoryIndex = ref(0)

const form = ref({
  name: '',
  category_id: 0,
  price: '',
  commission_rate: 10,
  stock: 0,
  unit: '件',
  description: ''
})

const categoryName = computed(() => {
  const cat = categories.value.find(c => c.value === form.value.category_id)
  return cat ? cat.text : ''
})

const leaderId = JSON.parse(localStorage.getItem('leaderInfo') || '{}').id

const loadCategories = async () => {
  try {
    const res = await request({ url: '/product/categories' })
    categories.value = res.data.map(c => ({ text: c.name, value: c.id }))
  } catch (e) {
    console.error(e)
  }
}

const loadDetail = async () => {
  try {
    const res = await request({ url: `/product/detail/${id}` })
    Object.assign(form.value, res.data)
    const idx = categories.value.findIndex(c => c.value === res.data.category_id)
    if (idx >= 0) selectedCategoryIndex.value = idx
  } catch (e) {
    console.error(e)
  }
}

const onCategoryConfirm = ({ selectedOptions }) => {
  form.value.category_id = selectedOptions[0].value
  showCategoryPopup.value = false
}

const handleSubmit = async () => {
  if (!form.value.name) {
    showToast('请输入商品名称')
    return
  }
  if (!form.value.price) {
    showToast('请输入售价')
    return
  }
  
  loading.value = true
  try {
    const data = { ...form.value, leader_id: leaderId }
    if (id) {
      await request({
        url: `/product/edit/${id}`,
        method: 'PUT',
        data
      })
      showToast('修改成功')
    } else {
      await request({
        url: '/product/add',
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
  loadCategories()
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
