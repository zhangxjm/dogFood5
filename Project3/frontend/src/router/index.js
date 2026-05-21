import { createRouter, createWebHistory } from 'vue-router'
import PollList from '../views/PollList.vue'
import CreatePoll from '../views/CreatePoll.vue'
import PollDetail from '../views/PollDetail.vue'
import VoteHistory from '../views/VoteHistory.vue'

const routes = [
  { path: '/', name: 'PollList', component: PollList },
  { path: '/create', name: 'CreatePoll', component: CreatePoll },
  { path: '/poll/:id', name: 'PollDetail', component: PollDetail },
  { path: '/history', name: 'VoteHistory', component: VoteHistory }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
