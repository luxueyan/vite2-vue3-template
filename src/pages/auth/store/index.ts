import createStore from '@/store'
import _actions from './actions'
import _getters from './getters'
import _mutations from './mutations'

const _state = {
  customBaseURL: '',
}
const _modules: Record<string, any> = {}

const context = import.meta.globEager('../view/**/store.ts')
Object.keys(context).forEach((v) => {
  const store = context[v].default
  _modules[store.name] = store
})

const store = createStore({ _state, _mutations, _getters, _actions, _modules })
export default store
