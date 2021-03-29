import * as commonEnums from '@/common/enums'
import { setupEnums } from '@/common/sharedTool'
import { App } from 'vue'
// import store from 'maintain/vuex/store'

const enums = import.meta.globEager('../views/**/enums.ts')

export default {
  install(app: App) {
    setupEnums(app, commonEnums)

    // private
    Object.keys(enums).forEach((v) => setupEnums(app, enums[v].default))
  },
}
