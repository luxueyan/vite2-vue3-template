export const name = 'auth'
export default {
  state() {
    return {
      auth: 1,
    }
  },
  getters: {
    auth(state) {
      return state.auth + 1
    },
  },
  actions: {
    getAuth({ commit }): void {
      commit('updateAuth', 2)
    },
  },
  mutations: {
    updateAuth(state, auth = 1) {
      state.auth = auth
    },
  },
}
