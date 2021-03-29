import app from '@/main.ts'
import filter from './common/filter'
import './index.css'
import router from './router'
import store from './store'

app.use(store)
app.use(filter)
router.run(app)

app.config.globalProperties.systemName = localStorage.systemName = 'AI认证系统'
// debug模式
localStorage.debug = import.meta.env.VITE_DEBUG_MODULE

// app.provide('$router', router)
