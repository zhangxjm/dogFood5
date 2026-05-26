import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '数据概览' }
  },
  {
    path: '/requests',
    name: 'Requests',
    component: () => import('../views/MoveRequests.vue'),
    meta: { title: '搬家需求登记' }
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue'),
    meta: { title: '车型管理' }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('../views/MoveRecords.vue'),
    meta: { title: '搬家完成记录' }
  },
  {
    path: '/ratings',
    name: 'Ratings',
    component: () => import('../views/Ratings.vue'),
    meta: { title: '服务评分录入' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
