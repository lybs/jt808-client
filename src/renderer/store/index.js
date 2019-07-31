import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState} from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogged: false,
    serialNo: null
  },
  getters: {
    isLogged (state) {
      return state.isLogged
    },
    serialNo (state) {
      return state.serialNo
    }
  },
  mutations: {
    SET_LOGIN_INFO (state, {isLogged, serialNo}) {
      state.isLogged = isLogged
      state.serialNo = serialNo
    }
  },
  actions: {
    setLoginInfo ({commit}, value) {
      commit('SET_LOGIN_INFO', value)
    }
  },
  modules,
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
