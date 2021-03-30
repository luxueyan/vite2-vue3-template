import app from '@/main.ts'
import filter from './common/filter'
import './index.css'
import router from './router'
import store from './store'
import { debug } from '@/common/debug'

app.use(store)
app.use(filter)
router.run(app)

app.config.globalProperties.systemName = localStorage.systemName = 'AI算力云运维平台'
// debug模式
localStorage.debug = import.meta.env.VITE_DEBUG_MODULE

// app.provide('$router', router)
window.addEventListener('authready', (e: CustomEventInit) => {
  const { token, user, permitMenu, permitButton } = e.detail
  debug('authready', e.detail)
  if (token === 'noload' && import.meta.env.VITE_STOP_PERMIT === 'false') return
  store.commit('updateToken', token)
  store.commit('updateUser', user || {})
  store.commit('updatePermitMenu', permitMenu || [])
  store.commit('updatePermitButton', permitButton || [])
//   router.run(app)
})

window.dispatchEvent(new CustomEvent('mainready', {}))
