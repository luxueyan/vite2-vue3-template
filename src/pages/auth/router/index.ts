// import App from 'demo/App.vue'
import createLocalRouter from '@/router'
import Api from 'auth/api'
import { App } from 'vue'
import store from '../store'
import routes from './routes'

const router = createLocalRouter({ store, routes, Api })

export default {
  run(app: App) {
    app.use(store)
    app.use(router)
    app.mount('#app')
  },
}

export { router }
