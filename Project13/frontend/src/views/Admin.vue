<template>
  <div class="admin-page">
    <van-nav-bar title="饮品管理">
      <template #right>
        <van-button size="small" type="primary" @click="showAddDialog = true">
          添加
        </van-button>
      </template>
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="loadDrinks">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadDrinks"
      >
        <van-cell-group v-for="drink in drinks" :key="drink.id" class="drink-card">
          <van-cell :title="drink.name" :label="drink.description">
            <template #value>
              <div>
                <span class="drink-price">¥{{ drink.price }}</span>
                <van-tag
                  :type="drink.available ? 'success' : 'default'"
                  size="small"
                  style="margin-left: 8px"
                >
                  {{ drink.available ? '上架' : '下架' }}
                </van-tag>
              </div>
            </template>
          </van-cell>
          <van-cell title="分类" :value="getCategoryText(drink.category)" />
          <van-cell>
            <template #value>
              <van-button size="small" type="primary" @click="editDrink(drink)">
                编辑
              </van-button>
              <van-button
                size="small"
                type="default"
                style="margin-left: 8px"
                @click="toggleAvailable(drink)"
              >
                {{ drink.available ? '下架' : '上架' }}
              </van-button>
              <van-button
                size="small"
                type="danger"
                style="margin-left: 8px"
                @click="deleteDrink(drink.id)"
              >
                删除
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>

    <van-dialog
      v-model:show="showAddDialog"
      :title="isEdit ? '编辑饮品' : '添加饮品'"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <van-form>
        <van-field
          v-model="form.name"
          label="饮品名称"
          placeholder="请输入饮品名称"
        />
        <van-field
          v-model="form.description"
          label="描述"
          type="textarea"
          placeholder="请输入描述"
          rows="2"
        />
        <van-field
          v-model="form.price"
          label="价格"
          type="digit"
          placeholder="请输入价格"
        />
        <van-field
          v-model="form.category"
          is-link
          readonly
          label="分类"
          placeholder="请选择分类"
          @click="showCategoryPicker = true"
        />
        <van-field name="image" label="图片URL">
          <template #input>
            <van-field v-model="form.image" placeholder="选填" />
          </template>
        </van-field>
      </van-form>
    </van-dialog>

    <van-popup v-model:show="showCategoryPicker" position="bottom">
      <van-picker
        :columns="categoryColumns"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { drinkApi } from '@/api'
import { showToast, showSuccessToast, showConfirmDialog } from 'vant'

const drinks = ref([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const showAddDialog = ref(false)
const showCategoryPicker = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = reactive({
  name: '',
  description: '',
  price: '',
  category: 1,
  image: '',
  available: true
})

const categoryColumns = [
  { text: '奶茶', value: 1 },
  { text: '果茶', value: 2 },
  { text: '特调', value: 3 },
  { text: '套餐', value: 4 }
]

const getCategoryText = (category) => {
  const item = categoryColumns.find(c => c.value === category)
  return item ? item.text : '未知'
}

const loadDrinks = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    const res = await drinkApi.getAll()
    if (res.code === 200) {
      drinks.value = res.data
      finished.value = true
    }
  } catch (e) {
    showToast('加载失败')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const editDrink = (drink) => {
  isEdit.value = true
  editId.value = drink.id
  Object.assign(form, {
    name: drink.name,
    description: drink.description,
    price: drink.price.toString(),
    category: drink.category,
    image: drink.image || '',
    available: drink.available
  })
  showAddDialog.value = true
}

const toggleAvailable = async (drink) => {
  try {
    const res = await drinkApi.update(drink.id, {
      ...drink,
      available: !drink.available
    })
    if (res.code === 200) {
      showSuccessToast(drink.available ? '下架成功' : '上架成功')
      loadDrinks()
    }
  } catch (e) {
    showToast('操作失败')
  }
}

const deleteDrink = async (id) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个饮品吗？'
    })
    const res = await drinkApi.delete(id)
    if (res.code === 200) {
      showSuccessToast('删除成功')
      loadDrinks()
    }
  } catch (e) {
    if (e !== 'cancel') {
      showToast('删除失败')
    }
  }
}

const onCategoryConfirm = ({ selectedOptions }) => {
  form.category = selectedOptions[0].value
  showCategoryPicker.value = false
}

const onConfirm = async () => {
  if (!form.name || !form.price) {
    showToast('请填写完整信息')
    return
  }

  try {
    const data = {
      ...form,
      price: parseFloat(form.price),
      available: isEdit.value ? form.available : true
    }
    
    let res
    if (isEdit.value) {
      res = await drinkApi.update(editId.value, data)
    } else {
      res = await drinkApi.create(data)
    }
    
    if (res.code === 200) {
      showSuccessToast(isEdit.value ? '编辑成功' : '添加成功')
      showAddDialog.value = false
      loadDrinks()
    }
  } catch (e) {
    showToast('操作失败')
  }
}

const onCancel = () => {
  Object.assign(form, {
    name: '',
    description: '',
    price: '',
    category: 1,
    image: '',
    available: true
  })
  isEdit.value = false
  editId.value = null
}

onMounted(() => {
  loadDrinks()
})
</script>

<style scoped>
.admin-page {
  padding-bottom: 50px;
}
.drink-card {
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
}
.drink-price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}
</style>
