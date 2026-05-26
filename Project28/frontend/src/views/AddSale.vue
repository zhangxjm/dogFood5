<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Record Sale</div>
      <div class="page-subtitle">Add a new sales record</div>
    </div>

    <div class="card">
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.categoryId"
          is-link
          name="categoryId"
          label="Category"
          placeholder="Select category"
          readonly
          @click="showCategoryPicker = true"
        />
        <van-popup v-model:show="showCategoryPicker" position="bottom">
          <van-picker
            :columns="categoryColumns"
            title="Select Category"
            @confirm="onCategoryConfirm"
            @cancel="showCategoryPicker = false"
          />
        </van-popup>

        <van-field
          v-model="form.quantity"
          name="quantity"
          label="Quantity"
          placeholder="Enter quantity"
          type="digit"
          required
          :rules="[{ required: true, message: 'Please enter quantity' }]"
        />

        <van-field
          v-model="form.unitPrice"
          name="unitPrice"
          label="Unit Price"
          placeholder="Enter unit price"
          type="digit"
          required
          :rules="[{ required: true, message: 'Please enter unit price' }]"
        />

        <div style="padding: 16px; background: #f7f8fa; margin: 0 -16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Total Amount:</span>
            <span style="font-size: 24px; font-weight: bold; color: #ff6b35;">
              ¥{{ calculatedTotal }}
            </span>
          </div>
        </div>

        <van-field
          v-model="form.salesDate"
          name="salesDate"
          label="Date"
          placeholder="Select date"
          readonly
          @click="showDatePicker = true"
        />
        <van-calendar
          v-model:show="showDatePicker"
          @confirm="onDateConfirm"
        />

        <van-field
          v-model="form.remark"
          name="remark"
          label="Remark"
          placeholder="Optional note"
          type="textarea"
          rows="2"
        />

        <div style="padding: 16px;">
          <van-button round block type="primary" native-type="submit">
            Save Record
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { api } from '../api'
import dayjs from 'dayjs'

const form = ref({
  categoryId: null,
  categoryName: '',
  quantity: '',
  unitPrice: '',
  totalAmount: null,
  salesDate: dayjs().format('YYYY-MM-DD'),
  remark: ''
})

const categories = ref([])
const showCategoryPicker = ref(false)
const showDatePicker = ref(false)

const categoryColumns = computed(() => {
  return categories.value.map(c => ({
    text: c.name,
    value: c.id
  }))
})

const calculatedTotal = computed(() => {
  const qty = parseFloat(form.value.quantity) || 0
  const price = parseFloat(form.value.unitPrice) || 0
  return (qty * price).toFixed(2)
})

const loadCategories = async () => {
  try {
    categories.value = await api.getActiveCategories()
  } catch (e) {
    console.error('Failed to load categories:', e)
  }
}

const onCategoryConfirm = ({ selectedOptions }) => {
  const selected = selectedOptions[0]
  form.value.categoryId = selected.value
  form.value.categoryName = selected.text
  const category = categories.value.find(c => c.id === selected.value)
  if (category) {
    form.value.unitPrice = category.unitPrice
  }
  showCategoryPicker.value = false
}

const onDateConfirm = (date) => {
  form.value.salesDate = dayjs(date).format('YYYY-MM-DD')
  showDatePicker.value = false
}

const onSubmit = async () => {
  try {
    form.value.totalAmount = parseFloat(calculatedTotal.value)
    await api.createRecord(form.value)
    showToast('Record saved successfully')
    form.value = {
      categoryId: null,
      categoryName: '',
      quantity: '',
      unitPrice: '',
      totalAmount: null,
      salesDate: dayjs().format('YYYY-MM-DD'),
      remark: ''
    }
  } catch (e) {
    console.error('Failed to save record:', e)
    showToast('Failed to save record')
  }
}

onMounted(() => {
  loadCategories()
})
</script>
