import routes from './routes.ts'
import Vue from 'vue'
import store from 'demo/store'
import App from 'demo/App.vue'
import createRouter from '@/router'
import Api from 'demo/api.js'

const router = createRouter({ store, routes, Api })

export default {
  run() {
    new Vue({
      render: h => h(App),
      store,
      i18n,
      router,
    }).$mount('#app')
  },
}

export { router }
