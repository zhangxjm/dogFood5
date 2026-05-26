import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/courses'
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/CourseList.vue'),
    meta: { title: '课程列表' }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: () => import('../views/CourseDetail.vue'),
    meta: { title: '课程详情' }
  },
  {
    path: '/registrations',
    name: 'Registrations',
    component: () => import('../views/RegistrationList.vue'),
    meta: { title: '报名记录' }
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: () => import('../views/ScheduleList.vue'),
    meta: { title: '课程表' }
  },
  {
    path: '/attendance/:scheduleId',
    name: 'Attendance',
    component: () => import('../views/Attendance.vue'),
    meta: { title: '考勤登记' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '亲子手工课报名系统'
  next()
})

export default router
