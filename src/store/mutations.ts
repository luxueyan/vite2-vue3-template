import { RouteLocationRaw } from 'vue-router'
import { LocalState } from './index'
import { debug } from '@/common/debug'

export default {
  updateUser(state: LocalState, user = {}) {
    window.localStorage.user = JSON.stringify(user)
    state.user = user
  },
  updatePermitMenu(state: LocalState, permitMenu: any[]) {
    window.localStorage.permitMenuList = JSON.stringify(permitMenu)
    state.permitMenuList = permitMenu
    debug('菜单权限：', permitMenu)
  },

  updatePermitButton(state: LocalState, permitButton: any[]) {
    window.localStorage.permitButtonList = JSON.stringify(permitButton)
    state.permitButtonList = permitButton
    debug('按钮权限：', permitButton)
  },

  updateToken(state: LocalState, token = '') {
    window.localStorage.token = token
    state.token = token
  },

  updateMenuCollapse(state: LocalState, collapse = false) {
    state.menuCollapse = collapse
  },

  shiftRouteStack(state: LocalState) {
    state.routeStack.shift()
  },

  pushRouteStack(state: LocalState, route: RouteLocationRaw) {
    if (state.routeStack.length > 20) {
      state.routeStack.shift()
    }
    state.routeStack.push(route)
  },
}
