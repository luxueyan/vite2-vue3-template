import App from '@/App.tsx'
// import store from './store'
// import router from './router'
// import createI18n from './i18n'
import Antd from 'ant-design-vue'
// import App from './components/Demo.jsx'
// import './assets/css/_var.css'
import 'ant-design-vue/dist/antd.css'
import { createApp } from 'vue'
// import './index.css'

// const i18n = createI18n({ store })
const app = createApp(App)
// app.use(store)
app.use(Antd)
// app.use(router)
// app.use(i18n)
// app.mount('#app')

// global config
// app.config.globalProperties.$locale = i18n.global.locale
// app.config.globalProperties.$t = i18n.global.t

// debug模式
localStorage.debug = import.meta.env.VITE_DEBUG_MODULE

// app.provide('$i18n', i18n)
// app.provide('$router', router)
export default app
