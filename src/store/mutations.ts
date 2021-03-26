import { LocalState } from './index'
export default {
  updateUser(state: LocalState, user = {}) {
    state.user = user
  },
}
