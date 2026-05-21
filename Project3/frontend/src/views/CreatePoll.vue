<template>
  <div class="create-poll">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="card-title mb-0">
              <i class="bi bi-plus-circle me-2"></i>创建新投票
            </h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">投票标题 <span class="text-danger">*</span></label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  placeholder="请输入投票标题"
                  required
                >
              </div>

              <div class="mb-3">
                <label class="form-label">投票描述</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                  placeholder="请输入投票描述（可选）"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">投票选项 <span class="text-danger">*</span></label>
                <div v-for="(option, index) in form.options" :key="index" class="input-group mb-2">
                  <span class="input-group-text">{{ index + 1 }}</span>
                  <input
                    v-model="form.options[index]"
                    type="text"
                    class="form-control"
                    placeholder="选项内容"
                    required
                  >
                  <button
                    v-if="form.options.length > 2"
                    type="button"
                    class="btn btn-outline-danger"
                    @click="removeOption(index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click="addOption"
                >
                  <i class="bi bi-plus me-1"></i>添加选项
                </button>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">截止时间</label>
                  <input
                    v-model="form.deadline"
                    type="datetime-local"
                    class="form-control"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">&nbsp;</label>
                  <div class="form-check mt-2">
                    <input
                      v-model="form.allowMultiple"
                      class="form-check-input"
                      type="checkbox"
                      id="allowMultiple"
                    >
                    <label class="form-check-label" for="allowMultiple">
                      允许多选
                    </label>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary flex-grow-1" :disabled="submitting">
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i class="bi bi-check-circle me-1"></i>创建投票
                </button>
                <router-link to="/" class="btn btn-secondary">
                  <i class="bi bi-x-circle me-1"></i>取消
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pollApi } from '../api'

const router = useRouter()
const submitting = ref(false)

const form = ref({
  title: '',
  description: '',
  options: ['', ''],
  deadline: '',
  allowMultiple: false
})

const addOption = () => {
  form.value.options.push('')
}

const removeOption = (index) => {
  form.value.options.splice(index, 1)
}

const handleSubmit = async () => {
  if (form.value.options.filter(o => o.trim()).length < 2) {
    alert('请至少填写2个有效选项')
    return
  }

  submitting.value = true
  try {
    const data = {
      ...form.value,
      options: form.value.options.filter(o => o.trim()),
      deadline: form.value.deadline || null
    }

    const response = await pollApi.createPoll(data)
    if (response.data.success) {
      alert('投票创建成功！')
      router.push('/')
    } else {
      alert(response.data.message || '创建失败')
    }
  } catch (error) {
    console.error('创建投票失败:', error)
    alert('创建投票失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>
