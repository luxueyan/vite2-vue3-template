import * as logger from '@/common/debug'
import { ApiInstance } from '@/common/sharedTool'
import { LocalState } from '@/store/index'
import { flattenDeep } from 'lodash-es'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import { Store } from 'vuex'

function MessageBox(int: any) {
  logger.debug(int)
}
// const debug = createDebug('router:index')

export interface LocalRouterOption {
  store: Store<LocalState>
  routes: RouteRecordRaw[]
  Api: ApiInstance
}

function createLocalRouter({ store, routes, Api }: LocalRouterOption) {
  const router: Router = createRouter({
    history: import.meta.env.PROD ? createWebHistory() : createWebHashHistory(),
    routes,
    //   parseQuery: (search) => ({}),
    //   stringifyQuery: (query) => '',
    strict: true,
    end: true,
    sensitive: true,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { top: 0 }
      }
    },
  })
  store._router = router // 为了api全局调用使用
  router.beforeEach(async (to, _from, next) => {
    if (to.name !== undefined) {
      document.body.setAttribute('route', to.name as string)
    }

    // if (document.querySelector(nprogress.settings.parent)) nprogress.start()
    const user = store.state.user
    const token = store.state.token
    let authorities = store.state.permitMenuList
    // 刷新页面要重新获取用户信息

    if (import.meta.env.VITE_STOP_PETMIT === 'false' && token && !user.name) {
      const user = await store
        .dispatch('getUser', { Api, config: { authorDefault: store.state.authorDefault } })
        .catch((err) => {
          store.dispatch('logout', { router: to, redirect: true })
          // next({ name: 'login' })
          throw err
        })
      logger.debug(user, token, authorities)
    }

    if (import.meta.env.VITE_STOP_PETMIT === 'true' || to.meta.skipAuth) {
      next()
    } else if (!to.meta.skipAuth && !token) {
      store.dispatch('logout', { router: to, redirect: true })
    } else if (!to.meta.skipAuth && !authorities.length) {
      MessageBox({
        message: '您没有任何权限(router)！',
        title: '提示',
        type: 'error',
      })
      store.dispatch('logout', { router: to })
    } else {
      getPermitRoute(to).then((newRoute) => (newRoute ? next(newRoute as RouteLocationRaw) : next()))
    }
  })

  router.afterEach((to: RouteLocationNormalized) => {
    // if (document.querySelector(nprogress.settings.parent)) nprogress.done()

    if (to.meta.title) {
      document.title = (to.meta?.title as string).replace('{}-', '') + '-' + localStorage.systemName
    }
  })

  /**
   * 获取基于权限的路由地址
   * @param {Route} a route Object
   * @return {Promise} a Promise Object
   */
  function getPermitRoute(to: RouteLocationNormalized) {
    return new Promise((resolve) => {
      const authorities = store.state.permitMenuList
      // const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)
      if (to.name === 'login') resolve(null)

      const menuAuthorities = flattenDeep(to.matched.map((v) => v.meta.authorities || []))
      if (menuAuthorities.some((a) => authorities.includes(a))) {
        resolve(null)
      } else {
        const mainRoutesParent = routes.find((r) => r.name === 'root')
        if (!mainRoutesParent) {
          return
        }
        const mainRoutes: RouteRecordRaw[] = mainRoutesParent.children || []
        // const flattenRoutes = flattenDeep(map(mainRoutes.children, child => child.children || child))
        const firstRoute = mainRoutes.find((r) =>
          (r.meta?.authorities as string[]).some((a) => authorities.includes(a)),
        )

        if (firstRoute) {
          resolve({
            name: firstRoute.name,
          })
        } else {
          MessageBox({
            message: '您没有任何权限(getPermitRoute)！',
            title: '提示',
            type: 'error',
          })
          store.dispatch('logout', { router: to })
        }
      }
    })
  }

  router.openInTab = function (route: RouteLocationRaw) {
    const resolveRoute = router.resolve(route)
    const href = `//${location.host}${resolveRoute.href}`
    window.open(href, '_blank')
  }

  router.smartBack = function (route: RouteLocationRaw) {
    const preRoute = store.state.routeStack.slice(-2, -1)[0]
    if (preRoute?.name === 'login') {
      router.push(route)
    } else {
      router.back()
    }
  }
  return router
}

export default createLocalRouter
