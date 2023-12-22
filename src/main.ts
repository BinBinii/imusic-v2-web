import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/css/theme.less'
import 'amfe-flexible/index.js'
import pinia from './store'

const app = createApp(App)

// 配置路由
app.use(router)
app.use(pinia)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })