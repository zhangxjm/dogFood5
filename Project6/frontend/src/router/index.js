import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('../views/Products.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue')
    },
    {
        path: '/customers',
        name: 'Customers',
        component: () => import('../views/Customers.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
