import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import '@/util/axios.config.js'
import Tres from '@tresjs/core'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
.use(ElementPlus)
.use(store)
.use(router)
.use(Tres)
.mount('#app')
