import Router from 'koa-router'
import glob from 'glob'
import { ParameterizedContext } from 'koa'
import createDebug from 'debug'

export type ParameterizedContextExtend = ParameterizedContext & { jsonOk?: (arg: any) => void }

const router = new Router()
const debug = createDebug('mock:setup')

router.prefix('/api/v1')
router.use(async (ctx: ParameterizedContextExtend, next) => {
  ctx.jsonOk = (data: Record<string | number, unknown>) => {
    ctx.status = 200
    ctx.set('Content-Type', 'application/json;charset=utf-8')
    ctx.body = JSON.stringify({ code: 0, data })
  }
  await next()
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
})

const apis = glob.sync('./api/**/*.ts')
apis.forEach((f) => {
  const routes = require(f).default
  Object.keys(routes).forEach((k) => {
    const kArr = k.split(' ')
    let method = 'get'
    let url = ''
    if (kArr.length === 1) {
      url = kArr[0]
    } else {
      method = kArr[0].toLowerCase()
      url = kArr[1]
    }
    /*eslint-disable*/
    debug(method, url, routes[k])
    router[method](
      url,
      typeof routes[k] === 'function'
        ? (...args) => routes[k](...args)
        : (ctx, next) => {
            ctx.jsonOk(routes[k])
            // return next()
          },
    )
    /*eslint-enable*/
  })
})

export default router
