import { ActionContext } from 'vuex'
import { LocalState } from './index'
import { debug } from '@/common/debug'

let logoutLock = false

export default {
  login({ commit }: ActionContext<LocalState, LocalState>): void {
    commit('updateUser', { id: 2 })
  },

  // 登出
  async logout({ commit }: ActionContext<LocalState, LocalState>, { silent = false, redirect = false, router } = {}) {
    if (logoutLock) return
    debug('logout', router)
    // await logouting.get({ token: state.token }, { skipAuth: true })
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    commit('updateUser', {})
    commit('updatePermitMenu', [])
    commit('updatePermitButton', [])
    commit('updateToken')
    // commit('updateTokenTime', '')
    // commit('updateTokenExpires', 0)
    if (silent) return
    // let redirect = router.history.current.name !== 'login' ? encodeURIComponent(`${window.location.origin}${router.fullPath}`) : ''
    let loginPath = `${window.SYSTEMS.VUE_APP_AUTH_ORIGIN}/auth/login`
    if (redirect) loginPath += `?redirect=${encodeURIComponent(window.location.href)}`
    window.open(loginPath, '_self')

    logoutLock = true
    setTimeout(() => {
      logoutLock = false
    }, 5000)
  },
}
