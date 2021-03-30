import App from '@/App.tsx'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { createApp } from 'vue'

const app = createApp(App)
app.use(Antd)

// debug模式
localStorage.debug = import.meta.env.VITE_DEBUG_MODULE

export default app
