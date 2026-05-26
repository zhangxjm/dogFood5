import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/script-type',
    name: 'ScriptType',
    component: () => import('../views/ScriptType.vue')
  },
  {
    path: '/script-inventory',
    name: 'ScriptInventory',
    component: () => import('../views/ScriptInventory.vue')
  },
  {
    path: '/session-record',
    name: 'SessionRecord',
    component: () => import('../views/SessionRecord.vue')
  },
  {
    path: '/player-record',
    name: 'PlayerRecord',
    component: () => import('../views/PlayerRecord.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
