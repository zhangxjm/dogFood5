import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/SalesRecord.vue')
  },
  {
    path: '/add-sale',
    name: 'AddSale',
    component: () => import('../views/AddSale.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics.vue')
  },
  {
    path: '/hot-sales',
    name: 'HotSales',
    component: () => import('../views/HotSales.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
