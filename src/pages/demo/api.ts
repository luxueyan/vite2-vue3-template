import createHttp from '@/common/api'
import store from 'demo/store'
import { setupApi } from '@/common/sharedTool'

const http = createHttp({ store })
const apis = import.meta.globEager('../view/**/api.ts')

export default setupApi(http, apis)
