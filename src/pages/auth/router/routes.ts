import { RouteRecordRaw } from 'vue-router'

const routes = import.meta.globEager('../views/**/routes.ts')
const children: RouteRecordRaw[] = Object.keys(routes)
  .map((k) => routes[k].default)
  .flat()

export default [
  {
    path: '/auth',
    name: 'root',
    redirect: { name: 'demo' },
    component: () => import('pages/_components/Layout.vue'),
    children,
  },
  {
    path: '/',
    redirect: { name: 'root' },
  },
]
