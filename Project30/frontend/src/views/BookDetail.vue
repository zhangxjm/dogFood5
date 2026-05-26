<template>
  <div v-loading="loading" class="book-detail-page">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="cover-card">
          <div class="cover-large">
            <img v-if="book?.cover_url" :src="book.cover_url" :alt="book.title" />
            <div v-else class="cover-placeholder-large">
              <el-icon><Notebook /></el-icon>
            </div>
          </div>
          <el-tag
            :type="book.status === 'available' ? 'success' : book.status === 'reserved' ? 'warning' : 'info'"
            size="large"
            class="status-tag"
          >
            {{ book.status }}
          </el-tag>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <h1 class="book-title">{{ book.title }}</h1>
          <el-descriptions :column="2" border style="margin-top: 16px">
            <el-descriptions-item label="Author">{{ book.author }}</el-descriptions-item>
            <el-descriptions-item label="ISBN">{{ book.isbn || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="Publisher">{{ book.publisher || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="Publish Year">{{ book.publish_year || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="Condition">
              <el-tag size="small">{{ book.condition }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Category">{{ book.category?.name || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="Owner">
              <el-link>{{ book.owner?.username }}</el-link>
              <span v-if="book.owner?.campus" class="owner-campus">({{ book.owner.campus }})</span>
            </el-descriptions-item>
            <el-descriptions-item label="Contact">
              <span v-if="book.owner?.contact">{{ book.owner.contact }}</span>
              <span v-else class="text-muted">Login to view contact</span>
            </el-descriptions-item>
          </el-descriptions>
          <div class="description-section">
            <h3>Description</h3>
            <p>{{ book.description || 'No description provided.' }}</p>
          </div>
          <div v-if="isLoggedIn && !isOwner" class="action-section">
            <el-divider />
            <el-button type="primary" size="large" :icon="ChatDotRound" @click="showMessageDialog = true">
              Send Exchange Intent
            </el-button>
          </div>
          <div v-if="isOwner" class="action-section">
            <el-divider />
            <el-tag type="info">This is your book</el-tag>
            <el-button type="primary" style="margin-left: 10px" @click="$router.push('/my-books')">
              Manage My Books
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="showMessageDialog" title="Send Exchange Intent" width="500px">
      <el-form :model="messageForm" label-position="top">
        <el-form-item label="Intent Type">
          <el-select v-model="messageForm.intent" style="width: 100%">
            <el-option label="Exchange" value="exchange" />
            <el-option label="Borrow" value="borrow" />
            <el-option label="Gift" value="gift" />
            <el-option label="Other" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Message">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
            placeholder="Tell the owner about your exchange offer..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMessageDialog = false">Cancel</el-button>
        <el-button type="primary" :loading="sendingMsg" @click="sendMessage">Send</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ChatDotRound } from '@element-plus/icons-vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const route = useRoute()
const authStore = useAuthStore()
const book = ref(null)
const loading = ref(false)
const showMessageDialog = ref(false)
const sendingMsg = ref(false)
const messageForm = ref({ intent: 'exchange', content: '' })

const isLoggedIn = computed(() => authStore.isLoggedIn)
const isOwner = computed(() => book.value && authStore.user?.id === book.value.owner_id)

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get(`/api/books/${route.params.id}`)
    book.value = res.data
  } catch (e) {
    ElMessage.error('Book not found')
  } finally {
    loading.value = false
  }
})

async function sendMessage() {
  if (!messageForm.value.content.trim()) {
    ElMessage.warning('Please enter a message')
    return
  }
  sendingMsg.value = true
  try {
    await api.post('/api/messages', {
      book_id: book.value.id,
      intent: messageForm.value.intent,
      content: messageForm.value.content
    })
    ElMessage.success('Message sent!')
    showMessageDialog.value = false
    messageForm.value = { intent: 'exchange', content: '' }
  } catch (e) {
    // error handled by interceptor
  } finally {
    sendingMsg.value = false
  }
}
</script>

<style scoped>
.book-detail-page {
  max-width: 1100px;
}
.cover-card {
  text-align: center;
}
.cover-large {
  width: 100%;
  height: 350px;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-placeholder-large {
  font-size: 120px;
  color: #c0c4cc;
}
.status-tag {
  font-size: 14px;
}
.book-title {
  margin: 0 0 10px 0;
  font-size: 28px;
}
.description-section {
  margin-top: 20px;
}
.description-section h3 {
  margin: 0 0 10px 0;
}
.description-section p {
  color: #606266;
  line-height: 1.6;
}
.action-section {
  margin-top: 10px;
}
.owner-campus {
  color: #909399;
  font-size: 13px;
}
.text-muted {
  color: #909399;
  font-size: 13px;
}
</style>
