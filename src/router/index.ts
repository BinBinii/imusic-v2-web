import { createRouter, createWebHashHistory } from 'vue-router'
import homeRouter from './home'

const router = createRouter({
  //  hash 模式。
  history: createWebHashHistory(),
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
