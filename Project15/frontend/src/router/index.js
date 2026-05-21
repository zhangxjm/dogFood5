import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/suppliers',
    component: () => import('../views/Suppliers.vue')
  },
  {
    path: '/products',
    component: () => import('../views/Products.vue')
  },
  {
    path: '/inventory',
    component: () => import('../views/Inventory.vue')
  },
  {
    path: '/orders',
    component: () => import('../views/Orders.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
