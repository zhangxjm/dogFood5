<template>
  <div class="messages-page">
    <h2>Messages</h2>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="Inbox" name="inbox">
        <div v-loading="loading" class="message-list">
          <el-card v-for="msg in inbox" :key="msg.id" class="message-card" :class="{ unread: !msg.is_read }">
            <div class="msg-header">
              <el-avatar :size="36">{{ msg.sender?.username?.charAt(0)?.toUpperCase() }}</el-avatar>
              <div class="msg-meta">
                <div class="msg-sender">
                  <strong>{{ msg.sender?.username }}</strong>
                  <el-tag v-if="!msg.is_read" type="danger" size="small" style="margin-left: 8px">NEW</el-tag>
                </div>
                <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
              </div>
              <el-tag :type="intentType(msg.intent)" size="small" class="intent-tag">
                {{ msg.intent }}
              </el-tag>
            </div>
            <div class="msg-content">{{ msg.content }}</div>
            <div class="msg-footer">
              <span class="book-ref">About: {{ msg.book_id }}</span>
              <el-button v-if="!msg.is_read" size="small" type="primary" @click="markRead(msg.id)">
                Mark as read
              </el-button>
            </div>
          </el-card>
          <el-empty v-if="!loading && inbox.length === 0" description="No messages in inbox" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Sent" name="sent">
        <div v-loading="loading" class="message-list">
          <el-card v-for="msg in sent" :key="msg.id" class="message-card">
            <div class="msg-header">
              <el-avatar :size="36" type="success">{{ msg.sender?.username?.charAt(0)?.toUpperCase() }}</el-avatar>
              <div class="msg-meta">
                <div class="msg-sender">
                  To: <strong>Book #{{ msg.book_id }}</strong> (owner)
                </div>
                <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
              </div>
              <el-tag :type="intentType(msg.intent)" size="small" class="intent-tag">
                {{ msg.intent }}
              </el-tag>
            </div>
            <div class="msg-content">{{ msg.content }}</div>
          </el-card>
          <el-empty v-if="!loading && sent.length === 0" description="No sent messages" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const activeTab = ref('inbox')
const inbox = ref([])
const sent = ref([])
const loading = ref(false)

onMounted(() => {
  loadInbox()
})

async function loadInbox() {
  loading.value = true
  try {
    const res = await api.get('/api/messages/inbox')
    inbox.value = res.data
  } catch (e) {} finally {
    loading.value = false
  }
}

async function loadSent() {
  loading.value = true
  try {
    const res = await api.get('/api/messages/sent')
    sent.value = res.data
  } catch (e) {} finally {
    loading.value = false
  }
}

function handleTabChange(tab) {
  if (tab === 'inbox') loadInbox()
  else if (tab === 'sent') loadSent()
}

async function markRead(id) {
  try {
    await api.post(`/api/messages/${id}/read`)
    ElMessage.success('Marked as read')
    loadInbox()
  } catch (e) {}
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

function intentType(intent) {
  switch (intent) {
    case 'exchange': return 'primary'
    case 'borrow': return 'warning'
    case 'gift': return 'success'
    default: return 'info'
  }
}
</script>

<style scoped>
.messages-page h2 {
  margin-bottom: 20px;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message-card {
  border-radius: 8px;
  transition: all 0.2s;
}
.message-card.unread {
  border-left: 4px solid #f56c6c;
  background: #fff8f8;
}
.msg-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.msg-meta {
  flex: 1;
}
.msg-sender {
  font-size: 14px;
}
.msg-time {
  color: #909399;
  font-size: 12px;
}
.intent-tag {
  text-transform: capitalize;
}
.msg-content {
  color: #303133;
  line-height: 1.5;
  padding: 8px 0;
}
.msg-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.book-ref {
  color: #909399;
  font-size: 13px;
}
</style>
