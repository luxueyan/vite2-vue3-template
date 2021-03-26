import { createStore } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
// import * as modules from 'globby!/pages/**/store.ts'

const modules = import.meta.globEager('../pages/**/store.ts')
// console.log(modules)
const moduleTree: Record<
  string,
  {
    [key: string]: any
  }
> = {}

Object.keys(modules).forEach((k) => {
  moduleTree[modules[k].name] = modules[k].default
})

export interface LocalState {
  user: Record<string, any>
  token: string
  lang: string
}

const store = createStore<LocalState>({
  state() {
    return {
      user: { id: 1 },
      token: '',
      lang: 'zh-CN',
    }
  },
  getters,
  actions,
  mutations,
  modules: moduleTree,
})

export default store
