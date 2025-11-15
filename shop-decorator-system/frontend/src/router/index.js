import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/Preview.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/Layout.vue'),
    meta: { requiresAuth: true },
    redirect: '/templates',
    children: [
      {
        path: 'templates',
        name: 'Templates',
        component: () => import('@/views/Templates.vue'),
        meta: { title: '模板中心' }
      },
      {
        path: 'editor/:id?',
        name: 'Editor',
        component: () => import('@/views/Editor.vue'),
        meta: { title: '装修编辑器' }
      },
      {
        path: 'my-designs',
        name: 'MyDesigns',
        component: () => import('@/views/MyDesigns.vue'),
        meta: { title: '我的方案' }
      },
      {
        path: 'admin/templates',
        name: 'AdminTemplates',
        component: () => import('@/views/AdminTemplates.vue'),
        meta: { title: '模板管理', requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
