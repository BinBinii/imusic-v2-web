import { createRouter, createWebHistory } from 'vue-router'
import homeRouter from './home'

const router = createRouter({
  history: createWebHistory('/web/'),
  routes: [
    homeRouter,
    // 设置首页
    {
      path: '/',
      component: () => import('../views/home/Home.vue')
    }
  ],
})

export default router
