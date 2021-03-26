// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')
// import 'vue-tsx-support/options/allow-unknown-props.d.ts'
// import 'vue-tsx-support/options/allow-element-unknown-attrs.d.ts'
import { createApp } from 'vue'
import store from './store'
import router from './router'
// import createI18n from './i18n'
import Antd from 'ant-design-vue'
import App from '@/App.tsx'
// import App from './components/Demo.jsx'
// import './assets/css/_var.css'
import 'ant-design-vue/dist/antd.css'
import './index.css'

// const i18n = createI18n({ store })
const app = createApp(App)

// console.log(i18n)
app.use(store)
app.use(router)
// app.use(i18n)
app.use(Antd)
app.mount('#app')

// global config
// app.config.globalProperties.$locale = i18n.global.locale
// app.config.globalProperties.$t = i18n.global.t

// debug模式
localStorage.debug = import.meta.env.VITE_DEBUG_MODULE

// app.provide('$i18n', i18n)
// app.provide('$router', router)
