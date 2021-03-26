import { ActionContext } from 'vuex'
import { LocalState } from './index'

export default {
  login({ commit }: ActionContext<LocalState, LocalState>): void {
    commit('updateUser', { id: 2 })
  },
}
