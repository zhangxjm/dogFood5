<template>
  <div class="poll-detail">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="!poll" class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
      <p class="text-muted">投票不存在</p>
      <router-link to="/" class="btn btn-primary">返回列表</router-link>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3 class="card-title mb-0">{{ poll.title }}</h3>
            <span :class="getStatusBadgeClass(poll)">
              {{ getStatusText(poll) }}
            </span>
          </div>
          <div class="card-body">
            <p v-if="poll.description" class="card-text text-muted mb-4">
              {{ poll.description }}
            </p>

            <div class="alert alert-info mb-4" v-if="hasVoted || !isVotable">
              <i class="bi bi-info-circle me-2"></i>
              <span v-if="hasVoted">您已投过票，以下是投票结果统计</span>
              <span v-else>该投票已结束，以下是投票结果统计</span>
            </div>

            <div v-if="isVotable && !hasVoted" class="vote-form mb-4">
              <h5 class="mb-3">请选择：</h5>
              <div v-for="option in poll.options" :key="option.id" class="mb-2">
                <div :class="['form-check', 'p-3', 'border', 'rounded', selectedOptions.includes(option.id) ? 'border-primary bg-primary-subtle' : '']">
                  <input
                    :type="poll.allowMultiple ? 'checkbox' : 'radio'"
                    :value="option.id"
                    :id="'option-' + option.id"
                    :name="poll.allowMultiple ? 'options' : 'option'"
                    class="form-check-input"
                    @change="toggleOption(option.id)"
                  >
                  <label :for="'option-' + option.id" class="form-check-label w-100">
                    {{ option.text }}
                  </label>
                </div>
              </div>
              <button
                class="btn btn-primary mt-3"
                :disabled="selectedOptions.length === 0 || submitting"
                @click="submitVote"
              >
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                提交投票
              </button>
            </div>

            <div v-else class="vote-results">
              <h5 class="mb-3">
                <i class="bi bi-bar-chart me-2"></i>投票结果
              </h5>
              <div class="mb-3">
                <span class="text-muted">总投票数：{{ totalVotes }} 票</span>
              </div>
              <div v-for="option in poll.options" :key="option.id" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>{{ option.text }}</span>
                  <span class="fw-bold">
                    {{ option.voteCount }} 票 ({{ getPercentage(option.voteCount) }}%)
                  </span>
                </div>
                <div class="progress" style="height: 25px;">
                  <div
                    class="progress-bar progress-bar-striped"
                    role="progressbar"
                    :style="{ width: getPercentage(option.voteCount) + '%' }"
                  >
                    {{ getPercentage(option.voteCount) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="bi bi-calendar me-1"></i>创建于 {{ formatDate(poll.createdAt) }}
            </small>
            <div>
              <button
                v-if="isVotable && !hasVoted"
                class="btn btn-outline-danger btn-sm me-2"
                @click="closePoll"
              >
                <i class="bi bi-lock me-1"></i>关闭投票
              </button>
              <router-link to="/" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-1"></i>返回列表
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pollApi, getVoterId } from '../api'

const route = useRoute()
const router = useRouter()
const poll = ref(null)
const loading = ref(true)
const hasVoted = ref(false)
const selectedOptions = ref([])
const submitting = ref(false)

const loadPoll = async () => {
  loading.value = true
  try {
    const response = await pollApi.getPollById(route.params.id)
    if (response.data.success) {
      poll.value = response.data.data
      await checkHasVoted()
    }
  } catch (error) {
    console.error('加载投票详情失败:', error)
  } finally {
    loading.value = false
  }
}

const checkHasVoted = async () => {
  try {
    const response = await pollApi.hasVoted(route.params.id)
    if (response.data.success) {
      hasVoted.value = response.data.data
    }
  } catch (error) {
    console.error('检查投票状态失败:', error)
  }
}

const isVotable = computed(() => {
  if (!poll.value) return false
  if (!poll.value.isActive) return false
  if (poll.value.deadline && new Date(poll.value.deadline) < new Date()) return false
  return true
})

const totalVotes = computed(() => {
  if (!poll.value || !poll.value.options) return 0
  return poll.value.options.reduce((sum, opt) => sum + (opt.voteCount || 0), 0)
})

const getPercentage = (count) => {
  if (totalVotes.value === 0) return 0
  return Math.round((count / totalVotes.value) * 100)
}

const toggleOption = (optionId) => {
  if (poll.value.allowMultiple) {
    const index = selectedOptions.value.indexOf(optionId)
    if (index > -1) {
      selectedOptions.value.splice(index, 1)
    } else {
      selectedOptions.value.push(optionId)
    }
  } else {
    selectedOptions.value = [optionId]
  }
}

const submitVote = async () => {
  if (selectedOptions.value.length === 0) return

  submitting.value = true
  try {
    const response = await pollApi.vote(route.params.id, {
      optionIds: selectedOptions.value,
      voterIdentifier: getVoterId()
    })

    if (response.data.success) {
      alert('投票成功！')
      hasVoted.value = true
      await loadPoll()
    } else {
      alert(response.data.message || '投票失败')
    }
  } catch (error) {
    console.error('投票失败:', error)
    alert('投票失败，请重试')
  } finally {
    submitting.value = false
  }
}

const closePoll = async () => {
  if (!confirm('确定要关闭此投票吗？')) return

  try {
    const response = await pollApi.closePoll(route.params.id)
    if (response.data.success) {
      alert('投票已关闭')
      await loadPoll()
    }
  } catch (error) {
    console.error('关闭投票失败:', error)
  }
}

const getStatusBadgeClass = (poll) => {
  if (!poll.isActive) return 'badge bg-secondary'
  if (poll.deadline && new Date(poll.deadline) < new Date()) return 'badge bg-danger'
  return 'badge bg-success'
}

const getStatusText = (poll) => {
  if (!poll.isActive) return '已关闭'
  if (poll.deadline && new Date(poll.deadline) < new Date()) return '已截止'
  return '进行中'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadPoll()
})
</script>
