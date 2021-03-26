import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './router'
const app = new Koa()

app.use(bodyParser({}))
app.use(router.routes()).use(router.allowedMethods())
app.listen(3300)
