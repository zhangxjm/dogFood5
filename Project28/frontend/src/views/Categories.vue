<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Categories</div>
      <div class="page-subtitle">Manage your menu items</div>
    </div>

    <div class="card">
      <van-button type="primary" block @click="showAddForm = true">
        + Add Category
      </van-button>
    </div>

    <van-popup v-model:show="showAddForm" position="bottom" round style="height: 70%">
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 20px;">{{ editingId ? 'Edit Category' : 'Add Category' }}</h3>
        <van-form @submit="saveCategory">
          <van-field
            v-model="form.name"
            label="Name"
            placeholder="Enter category name"
            required
          />
          <van-field
            v-model="form.description"
            label="Description"
            placeholder="Enter description"
            type="textarea"
            rows="2"
          />
          <van-field
            v-model="form.unitPrice"
            label="Unit Price"
            placeholder="Enter unit price"
            type="digit"
            required
          />
          <van-field
            v-model="form.isActive"
            label="Active"
            type="switch"
          />
          <div style="padding: 20px 0;">
            <van-button round block type="primary" native-type="submit">
              {{ editingId ? 'Update' : 'Save' }}
            </van-button>
            <van-button round block plain style="margin-top: 10px;" @click="showAddForm = false">
              Cancel
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <div class="section-title">All Categories</div>
    <div class="card" style="padding: 0;">
      <div v-if="categories.length === 0" class="empty-state">
        <div class="empty-icon">🍜</div>
        <div class="empty-text">No categories yet</div>
      </div>
      <div v-else>
        <div
          v-for="category in categories"
          :key="category.id"
          class="record-item"
        >
          <div class="record-info">
            <div class="record-name">
              {{ category.name }}
              <span
                v-if="!category.isActive"
                style="
                  font-size: 12px;
                  color: #999;
                  background: #f0f0f0;
                  padding: 2px 8px;
                  border-radius: 10px;
                  margin-left: 8px;
                "
              >
                Inactive
              </span>
            </div>
            <div class="record-meta">
              {{ category.description || 'No description' }}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="record-amount">¥{{ category.unitPrice }}</div>
            <van-icon name="edit" color="#1989fa" @click="editCategory(category)" />
            <van-icon name="delete-o" color="#ff4d4f" @click="deleteCategory(category.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { api } from '../api'

const categories = ref([])
const showAddForm = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  description: '',
  unitPrice: '',
  isActive: true
})

const loadCategories = async () => {
  try {
    categories.value = await api.getCategories()
  } catch (e) {
    console.error('Failed to load categories:', e)
  }
}

const editCategory = (category) => {
  editingId.value = category.id
  form.value = {
    name: category.name,
    description: category.description,
    unitPrice: category.unitPrice,
    isActive: category.isActive
  }
  showAddForm.value = true
}

const saveCategory = async () => {
  try {
    if (editingId.value) {
      await api.updateCategory(editingId.value, form.value)
      showToast('Updated successfully')
    } else {
      await api.createCategory(form.value)
      showToast('Created successfully')
    }
    showAddForm.value = false
    resetForm()
    loadCategories()
  } catch (e) {
    console.error('Failed to save category:', e)
    showToast('Failed to save')
  }
}

const deleteCategory = async (id) => {
  try {
    await showConfirmDialog({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this category?'
    })
    await api.deleteCategory(id)
    showToast('Deleted successfully')
    loadCategories()
  } catch (e) {
    if (e !== 'cancel') {
      console.error('Failed to delete category:', e)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    unitPrice: '',
    isActive: true
  }
}

onMounted(() => {
  loadCategories()
})
</script>
