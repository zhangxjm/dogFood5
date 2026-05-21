import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index.vue')
      },
      {
        path: 'mine',
        name: 'Mine',
        component: () => import('@/views/mine/index.vue')
      }
    ]
  },
  {
    path: '/product/form',
    name: 'ProductForm',
    component: () => import('@/views/product/form.vue')
  },
  {
    path: '/order/detail/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/detail.vue')
  },
  {
    path: '/order/verify',
    name: 'OrderVerify',
    component: () => import('@/views/order/verify.vue')
  },
  {
    path: '/pickup',
    name: 'Pickup',
    component: () => import('@/views/pickup/index.vue')
  },
  {
    path: '/pickup/form',
    name: 'PickupForm',
    component: () => import('@/views/pickup/form.vue')
  },
  {
    path: '/earnings',
    name: 'Earnings',
    component: () => import('@/views/earnings/index.vue')
  },
  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import('@/views/withdrawal/index.vue')
  },
  {
    path: '/withdrawal/apply',
    name: 'WithdrawalApply',
    component: () => import('@/views/withdrawal/apply.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const leaderInfo = localStorage.getItem('leaderInfo')
  if (to.path !== '/login' && !leaderInfo) {
    next('/login')
  } else if (to.path === '/login' && leaderInfo) {
    next('/home')
  } else {
    next()
  }
})

export default router
