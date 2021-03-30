import { ApiInstance } from '@/common/sharedTool'
import { ActionContext } from 'vuex'
import { LocalState } from './index'
import { debug } from '@/common/debug'

let logoutLock = false
type Action = ActionContext<LocalState, LocalState>

export default {
  // login({ commit }: Action): void {
  //   commit('updateUser', { id: 2 })
  // },

  // 获取用户信息
  async getUser({ commit }: Action, { Api = {}, config = {} }: any = {}) {
    const { data } = await Api.userInfo.get()
    const user = data.Result
    // if (config.authorDefault) user.authorities = config.authorDefault
    // else user.authorities = user.role.funcs ?.map(f => f.url) || []
    user.name = user.fullName || user.nickName || user.acctName
    commit('updateUser', user)
    return user
  },

  // 获取所有系统菜单的权限
  async permitMenu({ commit }: Action, params: any = {}) {
    const Api = params.Api
    const { data } = await Api.permitMenu.get({}, { pathParams: { appId: params.system } })
    const menuList = data.Result.map((val: any) => val.code)
    commit('updatePermitMenu', menuList)
    return menuList
  },

  // 获取所有系统按钮权限
  async permitButton({ commit }: Action, params: any = {}) {
    const Api = params.Api
    const { data } = await Api.permitButton.get({}, { pathParams: { appId: params.system } })
    const buttonList = data.Result.map((val: any) => val.code)
    commit('updatePermitButton', buttonList)
    return buttonList
  },

  // 登录
  async login({ commit, dispatch }: Action, params: { Api: any; user: any; config: any }) {
    const Api = params.Api
    const { data } = await Api.login.post(params.user)
    if (data.result) commit('updateToken', data.result || '')
    await dispatch('getUser', { Api, config: params.config })
    return data
  },

  // 更新token
  async refreshToken({ commit, state, dispatch }: Action, params: any = {}) {
    const Api = params.Api
    const data = await Api.refreshToken
      .get()
      .then((res) => res.data)
      .catch((e: Error) => {
        dispatch('logout')
        throw e
      })

    if (data.result) commit('updateToken', data.result || '')
    return data
  },

  // 返回权限系统首页
  goHome() {
    const location = window.location
    location.href = `${location.protocol}//${location.hostname}:8088/auth/index`
  },

  // 登出
  async logout(
    { commit }: ActionContext<LocalState, LocalState>,
    { silent = false, redirect = false, router }: any = {},
  ) {
    if (logoutLock) return
    debug('logout', router)
    // await logouting.get({ token: state.token }, { skipAuth: true })
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    commit('updateUser', {})
    commit('updatePermitMenu', [])
    commit('updatePermitButton', [])
    commit('updateToken')
    if (silent) return
    // let redirect = router.history.current.name !== 'login' ? encodeURIComponent(`${window.location.origin}${router.fullPath}`) : ''
    let loginPath = `${window.SYSTEMS.VITE_AUTH_ORIGIN}/auth/login`
    if (redirect) loginPath += `?redirect=${encodeURIComponent(window.location.href)}`
    window.open(loginPath, '_self')

    logoutLock = true
    setTimeout(() => {
      logoutLock = false
    }, 5000)
  },
}
