import { createStore, Store } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export type LocalState = Record<string, any>

export default function (options: Record<string, any>) {
  const { _modules, _state, _getters, _mutations, _actions } = options
  const store: Store<LocalState> = createStore<LocalState>({
    state() {
      return {
        user: { id: 1 },
        token: '',
        lang: 'zh-CN',
        ..._state,
      }
    },
    getters: { ...getters, ..._getters },
    actions: { ...actions, ..._actions },
    mutations: { ...mutations, ..._mutations },
    modules: _modules,
  })
  return store
}
