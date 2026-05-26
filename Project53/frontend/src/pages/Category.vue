<template>
  <div>
    <a-card>
      <a-space style="margin-bottom: 16px">
        <a-button type="primary" @click="showModal()">
          <template #icon><plus-outlined /></template>
          新增品类
        </a-button>
      </a-space>

      <a-table :columns="columns" :data-source="categories" :loading="loading" row-key="_id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showModal(record)">编辑</a-button>
              <a-popconfirm title="确定删除该品类？" @confirm="handleDelete(record._id)">
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑品类' : '新增品类'" @ok="handleSubmit">
      <a-form :model="formState" :rules="rules" ref="formRef" layout="vertical">
        <a-form-item label="品类名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入品类名称" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入描述" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { categoryApi } from '../services/api'

const loading = ref(false)
const categories = ref([])
const modalVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const formState = ref({ name: '', description: '' })

const rules = {
  name: [{ required: true, message: '请输入品类名称' }]
}

const columns = [
  { title: '品类名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180, customRender: ({ record }) => new Date(record.createdAt).toLocaleString('zh-CN') },
  { title: '操作', key: 'action', width: 150, fixed: 'right' }
]

const loadData = async () => {
  loading.value = true
  try {
    const res = await categoryApi.getAll()
    if (res.success) categories.value = res.data
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
    formState.value = { name: record.name, description: record.description || '' }
  } else {
    isEdit.value = false
    editId.value = null
    formState.value = { name: '', description: '' }
  }
  modalVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const res = isEdit.value
      ? await categoryApi.update(editId.value, formState.value)
      : await categoryApi.create(formState.value)
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
    const res = await categoryApi.delete(id)
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

onMounted(loadData)
</script>
