import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Inventory from '../views/Inventory.vue'
import Cleaning from '../views/Cleaning.vue'
import Usage from '../views/Usage.vue'
import Loss from '../views/Loss.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: '数据概览' } },
  { path: '/inventory', name: 'Inventory', component: Inventory, meta: { title: '布草库存' } },
  { path: '/cleaning', name: 'Cleaning', component: Cleaning, meta: { title: '清洗登记' } },
  { path: '/usage', name: 'Usage', component: Usage, meta: { title: '领用归还' } },
  { path: '/loss', name: 'Loss', component: Loss, meta: { title: '损耗记录' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
