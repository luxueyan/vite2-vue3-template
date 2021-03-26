import { createRouter, createWebHashHistory, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes = import.meta.globEager('../pages/**/routes.ts')
const children: RouteRecordRaw[] = Object.keys(routes)
  .map((k) => routes[k].default)
  .flat()

// console.log(children)

const router: Router = createRouter({
  history: import.meta.env.PROD ? createWebHistory() : createWebHashHistory(),
  routes: [
    {
      path: '/console',
      name: 'console',
      component: () => import('pages/_components/Layout.vue'),
      children,
    },
    {
      path: '/',
      redirect: { name: 'console' },
    },
  ],
  //   parseQuery: (search) => ({}),
  //   stringifyQuery: (query) => '',
  strict: true,
  end: true,
  sensitive: true,
  //   scrollBehavior(to, from, savedPosition) {},
})

export default router
