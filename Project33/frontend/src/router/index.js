import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/members',
    name: 'Members',
    component: () => import('@/views/Members.vue')
  },
  {
    path: '/member-levels',
    name: 'MemberLevels',
    component: () => import('@/views/MemberLevels.vue')
  },
  {
    path: '/consumption-records',
    name: 'ConsumptionRecords',
    component: () => import('@/views/ConsumptionRecords.vue')
  },
  {
    path: '/benefits',
    name: 'Benefits',
    component: () => import('@/views/Benefits.vue')
  },
  {
    path: '/benefit-claims',
    name: 'BenefitClaims',
    component: () => import('@/views/BenefitClaims.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router