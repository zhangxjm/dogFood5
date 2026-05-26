import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('./views/Documents.vue')
  },
  {
    path: '/documents/:id',
    name: 'DocumentDetail',
    component: () => import('./views/DocumentDetail.vue')
  },
  {
    path: '/my-tasks',
    name: 'MyTasks',
    component: () => import('./views/MyTasks.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('./views/Users.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
