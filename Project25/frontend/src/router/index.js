import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/category'
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/Category.vue')
  },
  {
    path: '/item',
    name: 'Item',
    component: () => import('@/views/Item.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/Order.vue')
  },
  {
    path: '/stockIn',
    name: 'StockIn',
    component: () => import('@/views/StockIn.vue')
  },
  {
    path: '/department',
    name: 'Department',
    component: () => import('@/views/Department.vue')
  },
  {
    path: '/claim',
    name: 'Claim',
    component: () => import('@/views/Claim.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/Statistics.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
